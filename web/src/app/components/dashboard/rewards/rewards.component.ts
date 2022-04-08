import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../../services/rest.service";
import {AvailableTokens} from "../../../data/available-tokens";
import {Observable, Subscription} from "rxjs";
import {WalletObserverService} from "../../../services/wallet-observer.service";
import {Token} from "../../../data/token";
import {Script} from "../../../data/script";
import {SpoRewardClaim} from "../../../data/spo-reward-claim";
import {WalletService} from "../../../services/wallet.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;
    public tokens: Array<Token> = [];
    public selectedTokens: Map<string, Token> = new Map<string, Token>();
    public claimReturn: string;
    public walletLoaded: boolean = false;
    public initialized: boolean = false;
    public listingTokens: boolean = false;
    public scanURLs = ["https://testnet.cardanoscan.io/transaction/", "https://testnet.cardanoscan.io/transaction/"];

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
                console.log("wallet loaded [" + loaded + "]");
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
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
        if (this.claimSubscription != null) {
            this.claimSubscription.unsubscribe();
            this.claimSubscription = null;
        }
    }

    public listTokens() {
        this.listingTokens = true;
        globalThis.tokens = [];
    /**    if (location.hostname === 'localhost') {
            const example: Token = new Token({
                "tokenname": "744d494e",
                "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
                "fingerprint": "sajdfqhw4iuhqwieufwae",
                "amount": 1000,
                selected: false
            });
            globalThis.tokens.push(example);
            this.tokens = [...globalThis.tokens];
            this.listingTokens = false;
        } else {**/
            this.claimReturn = null;
            globalThis.avialableTokens = new AvailableTokens();
            this.restService.getAvailableTokens()
                .then(res => this.processTokenList(res))
                .catch(e => this.handleError(e));
     //   }
    }

    public processTokenList(data: any) {
        globalThis.tokens = [];
        for (let i = 0; i < data.length; ++i) {
            const newToken = new Token(data[i]);
            if (newToken.amount > 0) {
                globalThis.tokens.push(newToken);
            }
        }
        this.tokens = [...globalThis.tokens];
        this.initialized = true;
        this.listingTokens = false;
    }

    public claimSelectedTokens() {
        if (this.claimSubscription == null) {
            this.claimSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.claimReturn = null;
                    console.log("claimSelectedTokens");
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
                    this.infoNotification("Submitting token claim");
                    this.restService.buildTokenClaimTx(globalThis.customerId, globalThis.multiSigType)
                        .then(res => {
                            this.selectedTokens.clear();
                            this.claimSubscription.unsubscribe();
                            this.claimSubscription = null;
                            if (res.msg) {
                                this.errorNotification("Error! " + res.msg);
                            } else {
                                this.processClaimTokens(res);
                            }
                        })
                        .catch(e => this.handleError(e));
                }
            });
            this.walletService.updateWallet();
        } else {
            this.warnNotification("Please wait.. currently attempting to claim tokens.");
        }
    }

    public processClaimTokens(data: any) {
        this.claimReturn = data;
        console.log("processClaimToken results:");
        console.log(data);
        const signature = globalThis.walletApi.signTx(data.tx, true);
        signature.then((finalSignature: Observable<string>) => {
            console.log(finalSignature);
            this.restService.signAndFinalizeTx(globalThis.customerId, globalThis.multiSigType, finalSignature, data)
                .then(res => this.processSignTx(res))
                .catch(e => this.handleError(e));
        });
    }

    public processSignTx(data: any) {
        console.log(data);
        if ((data != null) && (data.txhash != null)) {
            const txURL = "<br><a class=\"notifier__notification-message\" target=\"_blank\" href=\"" +
                this.scanURLs[globalThis.wallet.network] + data.txhash + "\">" + data.txhash + "</a>";
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
    }
}