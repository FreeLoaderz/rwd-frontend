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

@Component({
    selector: 'rewards',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;
    public tokens: Array<Token> = [];
    public submitURL: string = "/rwdbuild/multisig/6/sporwc";
    public listURL: string = "/rwdinfo/rewards/all";
    public tokenCols: any[] = [];
    public claimReturn: string;
    public listReturn: string;
    public walletLoaded: boolean = false;
    @ViewChild('fileUpload', {static: false}) public fileUpload: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService) {
        super(notifierService);
        this.tokenCols = [
            {field: 'tokenname', header: 'Token Name'},
            {field: 'currencysymbol', header: 'Currency Symbol'},
            {field: 'fingerprint', header: 'Fingerprint'},
            {field: 'amount', header: 'Amount'}
        ];
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
//                this.listTokens();
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
    }

    public addRow() {
        const token: Token = new Token(null);
        this.tokens.push(token);
    }

    public listTokens() {
        this.claimReturn = null;
        console.log(globalThis.wallet);
        globalThis.avialableTokens = new AvailableTokens();
        this.restService.fakeListTokens(this.listURL)
            .then(res => this.processTokenList(res))
            .catch(e => this.handleError(e));
//        this.restService.listTokens()
        //          .then(res => this.processTokenList(res))
        //        .catch(e => this.handleError(e));
    }

    public processTokenList(data: any) {
        this.tokens = [];
        console.log("processTokenList");
        console.log(data);
        for (let i = 0; i < data.length; ++i) {
            console.log(data[i])
            const newToken = new Token(null);
            newToken.tokenname = data[i].tokenname;
            newToken.currencysymbol = data[i].policy;
            newToken.fingerprint = data[i].fingerprint;
            newToken.amount = data[i].tot_earned - data[i].tot_claimed;
            this.tokens.push(newToken);
        }
        // push each to availableTokens
    }

    public claimSelectedTokens() {
        if (this.claimSubscription == null) {
            this.claimSubscription = this.walletObserverService.loaded$.subscribe(loaded => {
                if (loaded) {
                    /**    this.restService.claimTokens()
                     .then(res => this.processClaimTokens(res))
                     .catch(e => this.handleError(e));**/
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
                    this.restService.fakeClaimTokens(this.submitURL)
                        .then(res => {
                            if (res.msg) {
                                this.errorNotification("Error! "+res.msg);
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
            this.restService.signTx(finalSignature, data)
                .then(res => this.processSignTx(res))
                .catch(e => this.handleError(e));
        });
    }

    public processSignTx(data: any) {
        console.log(data);
        if (data.txhash) {
            this.successNotification("TX Successfully transmitted! [ADD CARDANO SCAN LINK]"+data.txhash);
        } else {
            this.errorNotification("TX Submission Failed! "+data.msg);
        }
    
        this.walletService.updateWallet();
    }

    public onEditComplete(event: any) {
    }

    onUpload(event) {
        this.claimReturn = null;
        const input = event.files;
        const reader: FileReader = new FileReader();
        reader.readAsText(input[0]);
        reader.onload = (e) => {
            const csv: any = reader.result;
            const split = csv.split("\n");
            for (let i = 1; i < split.length; ++i) {
                if (split[i] != null) {
                    split[i] = split[i].trim();
                    if (split[i] !== "") {
                        split[i] = split[i].replaceAll("\"", "");
                        const tokenSplit = split[i].split(",");
                        if (tokenSplit.length >= 4) {
                            const newToken = new Token(null);
                            newToken.tokenname = tokenSplit[0];
                            newToken.currencysymbol = tokenSplit[1];
                            newToken.fingerprint = tokenSplit[2];
                            newToken.amount = +tokenSplit[3];
                            this.tokens.push(newToken);
                        }
                    }
                }
            }
        };
        this.tokens = [...this.tokens];
        this.fileUpload.clear();
    }

    public delete(token: Token) {
        for (let i = 0; i < this.tokens.length; ++i) {
            if (this.tokens[i].tokenname === token.tokenname) {
                this.tokens.splice(i, 1);
                break;
            }
        }
        this.tokens = [...this.tokens];
    }

    public disableButtons(): boolean {
        if ((!this.walletLoaded) || (this.restService.isProcessingRequest())) {
            return true;
        }
        return false;
    }
}