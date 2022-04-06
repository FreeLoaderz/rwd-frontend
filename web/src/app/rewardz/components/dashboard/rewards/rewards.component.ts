import {Component, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../../../../common/components/notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../../../common/services/rest.service";
import {AvailableTokens} from "../../../../common/data/available-tokens";
import {Observable, Subscription} from "rxjs";
import {WalletObserverService} from "../../../../common/services/wallet-observer.service";
import {Token} from "../../../../common/data/token";
import {Script} from "../../../../common/data/script";
import {SpoRewardClaim} from "../../../../common/data/spo-reward-claim";
import {WalletService} from "../../../../common/services/wallet.service";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;
    public tokens: Array<Token> = [];
    public selectedTokens: Map<string, Token> = new Map<string, Token>();
    public claimReturn: string;
    public listReturn: string;
    public walletLoaded: boolean = false;
    @ViewChild('tokenView', {static: false}) public tokenView: any;

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
                if (loaded === true) {
                    this.listTokens();
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        if (this.walletLoaded === true) {
            this.listTokens();
        }
    }

    public listTokens() {
        globalThis.tokens = [];
        /**     if (location.hostname === 'localhost') {
            let tokenName = 1;
            let fingerprint = 100;
            for (let i = 1; i < 101; i++) {
                const example: Token = {
                    "tokenname": "token".concat((tokenName++).toFixed(0)),
                    "currencysymbol": "dd78158839fae805523ba4c0aa5cd3d7fa4adb43f7ae8c7ebf1d5dd9",
                    "fingerprint": "fp".concat((fingerprint++).toFixed(0)),
                    "amount": i,
                    "selected": false
                };
                globalThis.tokens.push(example);
            }
            this.tokens = [...globalThis.tokens];
        } else {**/
        this.claimReturn = null;
        console.log(globalThis.wallet);
        globalThis.avialableTokens = new AvailableTokens();
        this.restService.getAvailableTokens()
            .then(res => this.processTokenList(res))
            .catch(e => this.handleError(e));
        // }
    }

    public processTokenList(data: any) {
        globalThis.tokens = [];
        console.log(data);
        for (let i = 0; i < data.length; ++i) {
            console.log(data[i]);
            const newToken = new Token(null);
            newToken.tokenname = data[i].tokenname;
            newToken.currencysymbol = data[i].policy;
            newToken.fingerprint = data[i].fingerprint;
            newToken.amount = data[i].tot_earned - data[i].tot_claimed;
            if (newToken.amount > 0) {
                globalThis.tokens.push(newToken);
            }
        }
        this.tokens = [...globalThis.tokens];
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
                        if ((this.tokens[i] != null) && (this.tokens[i].tokenname != null)) {
                            rwd.reward_tokens.push(this.tokens[i]);
                        }
                    }
                    globalThis.wallet.script.SpoRewardClaim = rwd;
                    globalThis.wallet.script.SpoRewardClaim.recipient_stake_addr = globalThis.wallet.sending_stake_addr;
                    globalThis.wallet.script.SpoRewardClaim.recipient_payment_addr = globalThis.wallet.sending_wal_addrs[0];
                    this.claimSubscription.unsubscribe();
                    this.claimSubscription = null;
                    this.infoNotification("Submitting token claim");
                    this.restService.buildTokenClaimTx("6", "sporwc")
                        .then(res => {
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
            this.restService.signAndFinalizeTx(finalSignature, data)
                .then(res => this.processSignTx(res))
                .catch(e => this.handleError(e));
        });
    }

    public processSignTx(data: any) {
        console.log(data);
        if (data.txhash) {
            this.successNotification("TX Successfully transmitted! [ADD CARDANO SCAN LINK]" + data.txhash);
        } else {
            this.errorNotification("TX Submission Failed! " + data.msg);
        }

        this.walletService.updateWallet();
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