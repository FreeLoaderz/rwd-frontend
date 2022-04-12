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
import {UtilityService} from "../../../services/utility.service";
import {TokenMetadata} from "../../../data/token-metadata";
import {TokenMetadataService} from "../../../services/token-metadata.service";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;
    public tokenMetadataSubscription: Subscription;
    public tokens: Array<Token> = [];
    public selectedTokens: Map<string, Token> = new Map<string, Token>();
    public tokenMetadata: Map<string, TokenMetadata> = new Map<string, TokenMetadata>();
    public claimReturn: string;
    public walletLoaded: boolean = false;
    public initialized: boolean = false;
    public listingTokens: boolean = false;

    @ViewChild('tokenView', {static: false}) public tokenView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public titleService: Title, public tokenMetadataService: TokenMetadataService) {
        super(notifierService);
        if (globalThis.tokens == null) {
            globalThis.tokens = new Map<string, Token>();
        }
        this.titleService.setTitle("Rewards");
    }

    public ngOnInit() {
        this.tokenMetadataSubscription = this.tokenMetadataService.tokenMetadata$.subscribe(tokenMetadata => {
            this.processMetadata(tokenMetadata);
        });
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                console.log("wallet loaded [" + loaded + "]");
                this.walletLoaded = loaded;
                if ((loaded === true) && (!this.initialized)) {
                    this.listTokens();
                }
            }
        );
        this.tokenMetadata = this.tokenMetadataService.tokenMetadata;
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
        globalThis.tokens.clear();
     /**   if (location.hostname === 'localhost') {
            console.log("LOGO");
            console.log();
            const example: Token = new Token({
                "tokenname": "744d494e",
                "currencysymbol": "00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696e",
                "fingerprint": "sajdfqhw4iuhqwieufwae",
                "amount": 1000,
                "logo": "",
                selected: false
            });
            globalThis.tokens.set(example.tokenname, example);
            if (!this.tokenMetadata.has(example.tokenname)) {
                this.tokenMetadataService.getLogoMetadata(example.currencysymbol)
                    .then(res => this.processMetadata(new TokenMetadata(res)))
                    .catch(e => this.processError(e));
            }
            this.tokens = [...globalThis.tokens.values()];
            this.listingTokens = false;
        } else { **/
            this.claimReturn = null;
            globalThis.availableTokens = new AvailableTokens();
            this.restService.getAvailableTokens()
                .then(res => this.processTokenList(res))
                .catch(e => this.processError(e));
        // }
    }

    public processMetadata(tokenMetadata: TokenMetadata) {
        this.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
        if (globalThis.tokens.has(tokenMetadata.name)) {
            const token = globalThis.tokens.get(tokenMetadata.name);
            token.logo = tokenMetadata.logo;
            globalThis.tokens.set(tokenMetadata.name, token);
        }
        this.tokens = [...globalThis.tokens.values()];
    }

    /**
     * @TODO -> We have the list of tokens, but we don't have the logos for the tokens. Need to pull the logos,
     * store them in localstorage, associate them to the tokens from this list, then display them.
     */
    public processTokenList(data: any) {
        globalThis.tokens.clear();
        for (let i = 0; i < data.length; ++i) {
            const newToken = new Token(data[i]);
            if (newToken.amount > 0) {
                if (this.tokenMetadata.has(newToken.tokenname)) {
                    newToken.logo = this.tokenMetadata.get(newToken.tokenname).logo;
                    globalThis.tokens.set(newToken.tokenname, newToken);
                } else {
                    globalThis.tokens.set(newToken.tokenname, newToken);
                    this.tokenMetadataService.getLogoMetadata(newToken.currencysymbol)
                        .then(res => this.processMetadata(new TokenMetadata(res)))
                        .catch(e => this.processError(e));
                }
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
                        .catch(e => this.processError(e));
                }
            });
            this.walletService.updateWallet();
        } else {
            this.warnNotification("Please wait.. currently attempting to claim tokens.");
        }
    }

    public processClaimTokens(data: any) {
        this.claimReturn = data;
        console.log(data);
        const signature = globalThis.walletApi.signTx(data.tx, true);
        signature.then((finalSignature: Observable<string>) => {
            console.log(finalSignature);
            this.selectedTokens.clear();
            this.restService.signAndFinalizeTx(globalThis.customerId, globalThis.multiSigType, finalSignature, data)
                .then(res => this.processSignTx(res))
                .catch(e => this.processError(e));
        });
    }

    public processSignTx(data: any) {
        console.log(data);
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
    }

    public processError(error) {
        this.selectedTokens.clear();
        this.listingTokens = false;
        if (this.claimSubscription != null) {
            this.claimSubscription.unsubscribe();
            this.claimSubscription = null;
        }
        this.handleError(error);
    }
}