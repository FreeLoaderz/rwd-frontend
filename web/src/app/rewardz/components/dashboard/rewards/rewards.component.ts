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
import {MarketPlace} from "../../../../common/data/market-place";
import {SpoRewardClaim} from "../../../../common/data/rwd-specific";
import { Wallet } from "../../../../common/data/wallet";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit {
    public walletSubscription: Subscription;
    public tokens: Array<Token> = [];
    public submitURL: string = "/contracts/22/mp/claim";
    public tokenCols: any[] = [];
    @ViewChild('fileUpload', {static: false}) public fileUpload: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService) {
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
                this.listTokens();
            }
        );
    }

    public addRow() {
        const token: Token = new Token(null);
        this.tokens.push(token);
    }

    public listTokens() {
        console.log(globalThis.wallet);
        globalThis.avialableTokens = new AvailableTokens();
        this.restService.listTokens()
            .then(res => this.processTokenList(res))
            .catch(e => this.handleError(e));
    }

    public processTokenList(data: any) {
        console.log("processTokenList");
        console.log(data);
        // push each to availableTokens
    }

    public claimSelectedTokens() {
        /**    this.restService.claimTokens()
         .then(res => this.processClaimTokens(res))
         .catch(e => this.handleError(e));**/
         console.log("claimSelectedTokens");
        globalThis.wallet.script = new Script(null);
        const rwd = new SpoRewardClaim(null);
        for (let i = 0; i < this.tokens.length; ++i) {
            rwd.reward_tokens.push(this.tokens[i]);
        }
        globalThis.wallet.script.SpoRewardClaim = rwd;
        globalThis.wallet.script.SpoRewardClaim.recipient_stake_addr = globalThis.wallet.sending_stake_addr;
        globalThis.wallet.script.SpoRewardClaim.recipient_payment_addr = globalThis.wallet.sending_wal_addrs[0];


        this.restService.fakeClaimTokens(this.submitURL)
            .then(res => this.processClaimTokens(res))
            .catch(e => this.handleError(e));
    }

    public processClaimTokens(data: any) {
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
    }

    public onEditComplete(event: any) {
    }

    onUpload(event) {
        const input = event.files;
        const reader: FileReader = new FileReader();
        reader.readAsText(input[0]);
        reader.onload = (e) => {
            const csv: any = reader.result;
            const split = csv.split("\n");
            for (let i = 1; i < split.length; ++i) {
                split[i] = split[i].replaceAll("\"", "");
                const tokenSplit = split[i].split(",");
                const newToken = new Token(null);
                newToken.tokenname = tokenSplit[0];
                newToken.currencysymbol = tokenSplit[1];
                newToken.fingerprint = tokenSplit[2];
                newToken.amount = +tokenSplit[3];
                this.tokens.push(newToken);
            }
        };
        this.tokens = [...this.tokens];
        this.fileUpload.clear();
    }
}