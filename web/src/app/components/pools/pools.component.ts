import {Pool} from "../../data/pool";
import {Component, HostListener, Injectable, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Script} from "../../data/script";
import {StakeDelegation} from "../../data/stake-delegation";
import {UtilityService} from "../../services/utility.service";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Title} from "@angular/platform-browser";
import {PoolService} from "../../services/pool.service";
import {PoolObserverService} from "../../services/observers/pool-observer.service";
import {TokenService} from "../../services/token.service";

@Component({
    selector: 'pools',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './pools.html'
})
@Injectable()
export class PoolsComponent extends NotificationComponent implements OnInit, OnDestroy {
    public maxItems: number = 10;
    public showPaging: boolean = false;
    public submittingTx: boolean = false;
    public gridItemWidth: number = 300;
    public gridItemHeight: number = 300;
    public gridItemSmallWidth: number = 260;
    public gridItemSmallHeight: number = 260;
    public smallGrid: boolean = false;
    public poolDelegationReturn: string;
    public walletLoaded: boolean = false;
    public delegationSubscription: Subscription;
    public walletSubscription: Subscription;
    @Input() public pools: Array<Pool>;
    @Input() public inTokens: boolean = false;

    @ViewChild('poolView', {static: false}) public poolView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title, public poolService: PoolService, public poolObserverService: PoolObserverService) {
        super(notifierService);
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        this.getScreenSize(null);
    }

    public ngOnDestroy() {
        if (this.delegationSubscription != null) {
            this.delegationSubscription.unsubscribe();
            this.delegationSubscription = null;
        }
        this.walletSubscription.unsubscribe();
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

    public updatePools(pools: Array<Pool>) {
        this.pools = [...pools];
    }

    public delegate(pool: Pool) {
        if (this.delegationSubscription == null) {
            this.delegationSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.poolDelegationReturn = null;
                    globalThis.wallet.script = new Script(null);
                    const stakeDelegation = new StakeDelegation(pool.pool_id);
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

    public filterDataView(filter: string) {
        this.poolView.filter(filter);
    }

    public poolsLoaded() {
        return PoolService.finished;
    }
}