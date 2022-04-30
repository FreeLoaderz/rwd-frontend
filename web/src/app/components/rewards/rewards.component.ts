import {Component, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {AvailableTokens} from "../../data/available-tokens";
import {Observable, Subscription} from "rxjs";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {Token} from "../../data/token";
import {Script} from "../../data/script";
import {SpoRewardClaim} from "../../data/spo-reward-claim";
import {WalletService} from "../../services/wallet.service";
import {Title} from "@angular/platform-browser";
import {UtilityService} from "../../services/utility.service";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;
    public tokens: Array<Token> = [];
    public unfilteredTokens: Array<Token> = [];
    public maxItems: number = 10;
    public showPaging: boolean = true;
    public selectedTokens: Map<string, Token> = new Map<string, Token>();
    public claimReturn: string;
    public walletLoaded: boolean = false;
    public initialized: boolean = false;
    public listingTokens: boolean = false;
    public submittingTx: boolean = false;
    public selectAll: boolean = false;
    public gridItemWidth: number = 216;
    public gridItemHeight: number = 216;
    public gridItemSmallWidth: number = 191;
    public gridItemSmallHeight: number = 191;
    public smallGrid: boolean = false;

    @ViewChild('tokenView', {static: false}) public tokenView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title) {
        super(notifierService);
        if (globalThis.tokens == null) {
            globalThis.tokens = [];
        }

        this.titleService.setTitle("Rewards");
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if ((loaded === true) && (!this.initialized)) {
                    this.listTokens();
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        if (this.walletLoaded === true) {
            this.listTokens();
        }
        this.getScreenSize(null);
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
        if (this.claimSubscription != null) {
            this.claimSubscription.unsubscribe();
            this.claimSubscription = null;
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        console.log("Height [" + globalThis.screenHeight + "]");
        console.log("Width [" + globalThis.screenWidth + "]");
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
        if (this.maxItems < this.tokens.length) {
     //       this.showPaging = true;
        } else {
            this.showPaging = false;
        }
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }

    public listTokens() {
        this.listingTokens = true;
        globalThis.tokens = [];
        if (location.hostname === '127.0.0.1') {
            for (let i = 0; i < 100; i++) {
                const example: Token = new Token({
                    "tokenname": "tOken" + i,
                    "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
                    "fingerprint": "sajdfqhw4iuhqwieufwae",
                    "amount": 1000,
                    selected: false
                });
                globalThis.tokens.push(example);
                this.tokens = [...globalThis.tokens];
            }
            this.getScreenSize(null);
            this.listingTokens = false;
        } else {
            this.claimReturn = null;
            globalThis.avialableTokens = new AvailableTokens();
            this.restService.getAvailableTokens()
                .then(res => this.processTokenList(res))
                .catch(e => this.processError(e));
        }
    }

    public processTokenList(data: any) {
        globalThis.tokens = [];
        for (let i = 0; i < data.length; ++i) {
            const newToken = new Token(data[i]);
            if (newToken.amount > 0) {
                globalThis.tokens.push(newToken);
            }
        }
        globalThis.tokens.sort((a, b) => Token.sort(a, b));
        this.tokens = [...globalThis.tokens];
        this.initialized = true;
        this.listingTokens = false;
        this.getScreenSize(null);
    }

    public claimSelectedTokens() {
        if (this.claimSubscription == null) {
            this.claimSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.claimReturn = null;
                    globalThis.wallet.script = new Script(null);
                    const rwd = new SpoRewardClaim(null);
                    for (let i = 0; i < this.tokens.length; ++i) {
                        if ((this.tokens[i] != null) && (this.tokens[i].selected)) {
                            rwd.reward_tokens.push(this.tokens[i]);
                        }
                    }
                    globalThis.wallet.script.SpoRewardClaim = rwd;
                    globalThis.wallet.script.SpoRewardClaim.recipient_stake_addr = globalThis.wallet.sending_stake_addr;
                    globalThis.wallet.script.SpoRewardClaim.recipient_payment_addr = globalThis.wallet.sending_wal_addrs[0];
                    this.submittingTx = true;
                    this.restService.buildTokenClaimTx(globalThis.customerId, globalThis.multiSigType)
                        .then(res => {
                            if (res.msg) {
                                this.showError(res.msg);
                            } else {
                                this.processClaimTokens(res);
                            }
                        })
                        .catch(e => this.processError(e));
                }
            });
            this.walletService.updateWallet();
        } else {
            this.warnNotification("Please wait.. currently attempting to claim tokens.");
        }
    }

    public resetSelection(clearAll: boolean) {
        this.selectedTokens.clear();
        this.tokens.forEach(token => {
            token.selected = false;
        });
        this.listingTokens = false;
        if (this.claimSubscription != null) {
            this.claimSubscription.unsubscribe();
            this.claimSubscription = null;
        }
        this.submittingTx = false;
        if (clearAll) {
            this.selectAll = false;
        }
    }

    public processClaimTokens(data: any) {
        if ((data != null) && (data.tx != null)) {
            this.successNotification("Token claim created");
            this.claimReturn = data;
            console.log(data);
            const signature = globalThis.walletApi.signTx(data.tx, true);
            signature.then((finalSignature: Observable<string>) => {
                console.log(finalSignature);
                this.infoNotification("Submitting Signature");
                this.restService.signAndFinalizeTx(globalThis.customerId, globalThis.multiSigType, finalSignature, data)
                    .then(res => this.processSignTx(res))
                    .catch(e => this.processError(e));
            }).catch(e => this.showError(e));
        } else {
            this.errorNotification("Token claim could not be created");
        }
    }

    public processSignTx(data: any) {
        console.log(data);
        this.resetSelection(true);
        if ((data != null) && (data.txhash != null)) {
            const txURL = UtilityService.generateTxHashURL(data.txhash, true);
            this.customNotification("success", "TX Successfully transmitted! " + txURL, this.notificationTemplate);
        } else {
            this.errorNotification("TX Submission Failed! " + data.msg);
        }
        this.walletService.updateWallet();
        // list of tokens is now stale and wallet has to be updated..
        this.initialized = false;
    }

    public disableButtons(): boolean {
        if ((!this.walletLoaded) || (this.restService.isProcessingRequest())) {
            return true;
        }
        return false;
    }

    public toggleSelect(token: Token) {
        if (this.selectedTokens.has(token.fingerprint)) {
            token.selected = false;
            this.selectedTokens.delete(token.fingerprint);
        } else {
            token.selected = true;
            this.selectedTokens.set(token.fingerprint, token);
        }
        if (this.selectedTokens.size === this.tokens.length) {
            this.selectAll = true;
        } else {
            this.selectAll = false;
        }
    }

    public toggleSelectAll() {
        this.selectAll = !this.selectAll;
        this.resetSelection(false);
        if (this.selectAll) {
            this.tokens.forEach(token => {
                token.selected = true;
                this.selectedTokens.set(token.fingerprint, token);
            });
        }
    }

    public showError(error) {
        this.resetSelection(true);
        this.errorNotification(error);
    }

    public processError(error) {
        this.resetSelection(true);
        this.handleError(error);
    }

    onFilter(event, dt) {
        this.unfilteredTokens = [...event.filteredValue];
    }

}