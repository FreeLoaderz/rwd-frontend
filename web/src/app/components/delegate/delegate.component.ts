import {Component, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {Observable, Subscription} from "rxjs";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";
import {Script} from "../../data/script";
import {WalletService} from "../../services/wallet.service";
import {Title} from "@angular/platform-browser";
import {UtilityService} from "../../services/utility.service";
import {Pool} from "../../data/pool";
import {StakeDelegation} from "../../data/stake-delegation";
import {PoolService} from "../../services/pool.service";
import {PoolObserverService} from "../../services/observers/pool-observer.service";

@Component({
    selector: 'delegate',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './delegate.html'
})

export class DelegateComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public delegationSubscription: Subscription;
    public poolSubscription: Subscription;
    public pools: Array<Pool> = [];
    public maxItems: number = 10;
    public showPaging: boolean = false;
    public poolDelegationReturn: string;
    public walletLoaded: boolean = false;
    public initialized: boolean = false;
    public listingPools: boolean = false;
    public submittingTx: boolean = false;
    public gridItemWidth: number = 300;
    public gridItemHeight: number = 300;
    public gridItemSmallWidth: number = 260;
    public gridItemSmallHeight: number = 260;
    public smallGrid: boolean = false;
    public isPreview: boolean = false;
    public wasPreview: boolean = false;
    @ViewChild('poolView', {static: false}) public poolView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title, public poolService: PoolService, public poolObserverService: PoolObserverService) {
        super(notifierService);
        if (globalThis.pools == null) {
            globalThis.pools = [];
        }

        this.titleService.setTitle("Pools");
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (this.walletLoaded) {
                    this.wasPreview = this.isPreview;
                    this.setNetwork();
                    if (this.wasPreview !== this.isPreview) {
                        this.listPools();
                    }
                }
            }
        );
        this.poolSubscription = this.poolObserverService.poolList$.subscribe(
            poolList => {
                this.poolDelegationReturn = null;
                this.processPoolList(poolList);
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        this.setNetwork();
        this.getScreenSize(null);
        this.listPools();
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
        this.poolSubscription.unsubscribe();
        if (this.delegationSubscription != null) {
            this.delegationSubscription.unsubscribe();
            this.delegationSubscription = null;
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        let usableWidth = globalThis.screenWidth * .75;
        const usableHeight = globalThis.screenHeight * .75;
        this.smallGrid = false;
        if (globalThis.screenHeight < 500) {
            this.smallGrid = true;
        }
        if (globalThis.screenWidth < 900) {
            this.smallGrid = true;
            usableWidth = globalThis.screenWidth * .95;
        }
        if (this.smallGrid) {
            const maxPerRow = Math.floor(usableWidth / this.gridItemSmallWidth);
            const maxVisableRows = Math.floor(usableHeight / this.gridItemSmallHeight);
            this.maxItems = +maxPerRow * +maxVisableRows;
        } else {
            const maxPerRow = Math.floor(usableWidth / this.gridItemWidth);
            const maxVisableRows = Math.floor(usableHeight / this.gridItemHeight);
            this.maxItems = +maxPerRow * +maxVisableRows;
        }
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }

    public listPools() {
        this.listingPools = true;
        globalThis.pools = [];
        if (this.isPreview) {
            const pools: Array<Pool> = [];
            const apex: Pool = new Pool({
                "name": "Apex Cardano Pool",
                "description": "APEX Stake Pool: Low fees - 340 Fixed Cost and 1.5% Margin (variable fee). SPO with 24 years of IT experience, supporting the Cardano community and the decentralization of Cardano. Delegate your ADA to APEX Pool!",
                "ticker": "APEX",
                "homepage": "https://apexpool.info/",
                "extended": "https://apexpool.info/extended.json",
                "pool_id": "5a849bd6a495d0630f6ba6a367ba4e2b3ccc7a53515812105560c152",
                "logo": "https://apexpool.info/img/logo.png"
            });
            const tpanl: Pool = new Pool({
                "name": "PANL Stake Pool (Preview)",
                "description": "Proudly contributing to the longevity of the Cardano network through reliable node operation",
                "ticker": "PANL",
                "homepage": "https://www.panl.org",
                "pool_id": "2d74b091820b0aadce3c9e8f8afd9117c706968162867cb725ba478d",
                "logo": "https://logo.panl.org"
            });
            const envy: Pool = new Pool({
                "name": "ENVY Preview Pool",
                "description": "ENVY provides excellent staking service, with zero margin fees. 20% operator rewards are donated to Dave Thomas Foundation for Adoption & Save the Children. @EnvyStakePool on Twitter & www.envystakepool.com. We support decentralization.",
                "ticker": "ENVY",
                "homepage": "https://envystakepool.com",
                "extended": "https://git.io/Ju1j9",
                "pool_id": "bf81c32d4b8d05538431743190421b5e0fc2384c605c2ddfbeabbd5a",
                "logo": "https://static.wixstatic.com/media/63a3ee_c86a030e820640eda11b6342d3e45610~mv2.png"
            });
            const santo: Pool = new Pool({
                "name": "SANTO",
                "description": "Santo Cardano Stake Pool.",
                "ticker": "SANTO",
                "homepage": "https://www.santoelectronics.com/santonode",
                "pool_id": "bf81c32d4b8d05538431743190421b5e0fc2384c605c2ddfbeabbd5a",
                "logo": "https://santoelectronics.com/s/santo.png"
            });
            pools.push(apex);
            pools.push(envy);
            pools.push(santo);
            pools.push(tpanl);
            this.poolDelegationReturn = null;
            this.processPoolList(pools);
        } else {
            this.poolDelegationReturn = null;
            this.processPoolList(PoolService.poolList);
        }
        /**
         this.restService.getAvailablePools()
         .then(res => this.processPoolList(res))
         .catch(e => this.processError(e));
         */
    }

    public processPoolList(data: any) {
        globalThis.pools = [];
        for (let i = 0; i < data.length; ++i) {
            const newPool = new Pool(data[i]);
            globalThis.pools.push(newPool);
        }
        globalThis.pools.sort((a, b) => Pool.sort(a, b));
        this.pools = [...globalThis.pools];
        this.initialized = true;
        this.listingPools = false;
        this.getScreenSize(null);
    }

    public delegate(pool: Pool) {
        if (this.delegationSubscription == null) {
            this.delegationSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.poolDelegationReturn = null;
                    globalThis.wallet.script = new Script(null);
                    const stakeDelegation = new StakeDelegation(pool.poolhash);
                    globalThis.wallet.script.StakeDelegation = stakeDelegation;
                    this.submittingTx = true;
                    this.restService.buildDelegationTx()
                        .then(res => {
                            if (res.msg) {
                                this.showError(res.msg);
                            } else {
                                this.processDelegationTx(res);
                            }
                        })
                        .catch(e => this.processError(e));
                }
            });
            this.walletService.updateWallet();
        } else {
            this.warnNotification("Please wait.. currently attempting to delegate.");
        }
    }

    public processDelegationTx(data: any) {
        if (this.delegationSubscription != null) {
            this.delegationSubscription.unsubscribe();
            this.delegationSubscription = null;
        }
        if ((data != null) && (data.tx != null)) {
            this.successNotification("Delegation tx created");
            this.poolDelegationReturn = data;
            const signature = globalThis.walletApi.signTx(data.tx, true);
            signature.then((finalSignature: Observable<string>) => {
                this.infoNotification("Submitting Signature");
                this.restService.signDelegationTx(finalSignature, data)
                    .then(res => this.processSignTx(res))
                    .catch(e => this.processError(e));
            }).catch(e => this.showError(e));
        } else {
            this.errorNotification("Delegation could not be completed!");
        }
    }

    public processSignTx(data: any) {
        if ((data != null) && (data.txhash != null)) {
            const txURL = UtilityService.generateTxHashURL(data.txhash, true);
            this.customNotification("success", "Delegation successful! " + txURL, this.notificationTemplate);
        } else {
            this.errorNotification("Delegation Failed! " + data.msg);
        }
        this.walletService.updateWallet();
        this.submittingTx = false;
    }

    public disableButtons(): boolean {
        if ((!this.walletLoaded) || (this.restService.isProcessingRequest())) {
            return true;
        }
        return false;
    }


    public showError(error) {
        this.errorNotification(error);
        if (this.delegationSubscription != null) {
            this.delegationSubscription.unsubscribe();
            this.delegationSubscription = null;
        }
        this.submittingTx = false;
    }

    public processError(error) {
        this.handleError(error);
        if (this.delegationSubscription != null) {
            this.delegationSubscription.unsubscribe();
            this.delegationSubscription = null;
        }
        this.submittingTx = false;
    }

    public setNetwork() {
        if (globalThis.wallet != null) {
            this.isPreview = (true === (0 === globalThis.wallet.network));
        } else {
            this.isPreview = false;
        }
    }

    public filterDataView(filter: string) {
        this.poolView.filter(filter);
    }
}