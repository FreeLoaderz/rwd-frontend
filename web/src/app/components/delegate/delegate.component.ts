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
import {ModalDirective} from "ngx-bootstrap/modal";

@Component({
    selector: 'delegate',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './delegate.html'
})

export class DelegateComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public delegationSubscription: Subscription;
    public pools: Array<Pool> = [];
    public selectedPool: Pool = null;
    public maxItems: number = 10;
    public showPaging: boolean = false;
    public poolDelegationReturn: string;
    public walletLoaded: boolean = false;
    public initialized: boolean = false;
    public listingPools: boolean = false;
    public submittingTx: boolean = false;
    public gridItemWidth: number = 216;
    public gridItemHeight: number = 216;
    public gridItemSmallWidth: number = 191;
    public gridItemSmallHeight: number = 191;
    public smallGrid: boolean = false;
    public isTestnet: boolean = true;
    @ViewChild('poolView', {static: false}) public poolView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;
    @ViewChild('delegateModal', {static: false}) public delegateModal: ModalDirective;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title) {
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
                this.setNetwork();
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        this.listPools();
        this.getScreenSize(null);
        this.setNetwork();
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
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
        const apex: Pool = new Pool({
            "name": "Apex Cardano Pool",
            "description": "APEX Stake Pool: Low fees - 340 Fixed Cost and 1.5% Margin (variable fee). SPO with 24 years of IT experience, supporting the Cardano community and the decentralization of Cardano. Delegate your ADA to APEX Pool!",
            "ticker": "APEX",
            "homepage": "https://apexpool.info/",
            "extended": "https://apexpool.info/extended.json",
            "id": "5f5ed4eb2ba354ab2ad7c8859f3dacf93564637a105e80c8d8a7dc3c",
            "logo": "https://apexpool.info/img/logo.png"
        });
        const tpanl: Pool = new Pool({
            "name": "TPANL",
            "description": "PANL Stake Pool Test Environment",
            "ticker": "TPANL",
            "homepage": "https://www.panl.org",
            "id": "6762b21773213a40496489abd3bb94baeae99d8a0373a198472222a4",
            "logo": ""
        });
        const lido: Pool = new Pool({
            "name": "Lido Nation",
            "description": "Community for everyone.",
            "ticker": "LIDO",
            "homepage": "https://www.lidonation.com",
            "extended": "https://www.lidonation.com/metadata-extended.json",
            "id": "bf81c32d4b8d05538431743190421b5e0fc2384c605c2ddfbeabbd5a",
            "logo": "https://www.lidonation.com/img/lido-logo-square-white-bg.png"
        });
        const pools: Array<Pool> = [];
        pools.push(apex);
        pools.push(tpanl);
        pools.push(lido);
        this.poolDelegationReturn = null;
        this.processPoolList(pools);
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

    public delegate() {
        if (this.delegationSubscription == null) {
            this.hideDelegateModal();
            this.delegationSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.poolDelegationReturn = null;
                    globalThis.wallet.script = new Script(null);
                    const stakeDelegation = new StakeDelegation(this.selectedPool.poolhash);
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
            this.errorNotification("Token claim could not be created");
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
    }

    public disableButtons(): boolean {
        if ((!this.walletLoaded) || (this.restService.isProcessingRequest())) {
            return true;
        }
        return false;
    }


    public showError(error) {
        this.errorNotification(error);
    }

    public processError(error) {
        this.handleError(error);
    }

    public setNetwork() {
        if (globalThis.wallet != null) {
            this.isTestnet = (true === (0 === globalThis.wallet.network));
        } else {
            this.isTestnet = true;
        }
    }

    public showDelegateModal(pool: Pool) {
        this.selectedPool = pool;
        this.delegateModal.show();
    }

    public hideDelegateModal() {
        this.delegateModal.hide();
    }
}