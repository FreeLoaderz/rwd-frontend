import {Component, HostListener, Inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {Title} from "@angular/platform-browser";
import {Pool} from "../../data/pool";
import {TokenService} from "../../services/token.service";
import {Token} from "../../data/token";
import {TokenObserverService} from "../../services/observers/token-observer.service";
import {Subscription} from "rxjs";
import {PoolService} from "../../services/pool.service";
import {PoolsComponent} from "../pools/pools.component";
import {DOCUMENT} from "@angular/common";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";

@Component({
    selector: 'tokens',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: 'tokens.html'
})

export class TokensComponent extends NotificationComponent implements OnInit, OnDestroy {
    public tokens: Array<Token> = [];
    public pools: Array<Pool> = [];
    public maxItems: number = 10;
    public showPaging: boolean = false;
    public initialized: boolean = false;
    public gridItemWidth: number = 300;
    public gridItemHeight: number = 300;
    public gridItemSmallWidth: number = 260;
    public gridItemSmallHeight: number = 260;
    public smallGrid: boolean = true;
    public isPreview: boolean = false;
    public listingPools: boolean = true;
    public selectedToken: Token = null;
    public tokenSubscription: Subscription;
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    @ViewChild('tokenView', {static: false}) public tokenView: any;
    @ViewChild('poolView', {static: false}) public poolView: PoolsComponent;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(@Inject(DOCUMENT) public document: any,
                public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public restService: RestService,
                public titleService: Title, public tokenObserverService: TokenObserverService) {
        super(notifierService);
        if (globalThis.tokens == null) {
            globalThis.tokens = [];
        }
        this.tokenSubscription = this.tokenObserverService.tokenList$.subscribe(tokenList => {
            if (tokenList.length > 0) {
                this.listTokens();
            }
        });
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if ((loaded === true) && (!this.initialized)) {
                    this.isPreview = (globalThis.wallet.network === 0);
                    this.listTokens();
                }
            }
        );
        this.titleService.setTitle("Tokens");
    }

    public ngOnInit() {
        this.getScreenSize(null);
        if (this.tokenObserverService.tokenList.length > 0) {
            this.listTokens();
        }
    }

    public ngOnDestroy() {
        this.tokenSubscription.unsubscribe();
        this.walletSubscription.unsubscribe();
    }

    public tokensLoaded() {
        return TokenService.finished;
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

    public listTokens() {
        this.tokens = [...TokenService.tokenList];
    }

    public filterDataView(filter: string) {
        this.tokenView.filter(filter);
    }

    public details(token: Token) {
        this.listingPools = true;
        this.selectedToken = token;
        this.pools = [];
        if (token != null) {
            for (let i = 0; i < token.pools.length; ++i) {
                if (PoolService.poolMap.has(token.pools[i])) {
                    const pool = PoolService.poolMap.get(token.pools[i]);
                    this.pools.push(pool);
                } else {
                    console.log("Missing pool [" + token.pools[i] + "]");
                }
            }
            this.pools = [...this.pools];
            setTimeout(() => {
                if (this.poolView != null) {
                    this.poolView.updatePools(this.pools);
                }
            });
            this.listingPools = false;
            this.document.getElementById("topAnchor").scrollIntoView({block: "start", inline: "nearest"});
        }
    }
}