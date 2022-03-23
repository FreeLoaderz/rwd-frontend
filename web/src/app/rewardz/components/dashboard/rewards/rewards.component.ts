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
        globalThis.wallet.script = new Script(null);
        const mp = new MarketPlace(null);
        for (let i = 0; i < this.tokens.length; ++i) {
            mp.tokens.push(this.tokens[i]);
        }
        globalThis.wallet.script.Marketplace = mp;
        globalThis.wallet.script.Marketplace.metadata = [
            "3435303030303030",
            "bae29468a207f24428dabbf5b5d8fcb699002cea33d6381672851a31",
            "30",
            "1ed9a5cd8796440d22d11198046cf8a680e634ff564a5b40eb3b2830",
            "517cfcde73912db9a4385adc3da8515cb6361b78ca0e5a97d66f832c",
            "4172746966637473546573744e6674303030303032",
            "616464725f7374616b65316e3264347478667374336632646e38766764676b",
            "6e336530717939616c63356d766b766d326b63337066706779776d61736668",
            "617274696663742d636c692d417274694c42554376312e302e30"
        ];
        globalThis.wallet.script.Marketplace.royalties_addr = "000e5a9d20e9a5b16c5c1879368422b6c864d512ba5a8ccc40bfdaae4030b592cedfb75533b2dc0cec3dee1c893e23adaa3379f757046dde0b";
        globalThis.wallet.script.Marketplace.royalties_rate = 0.2;
        globalThis.wallet.script.Marketplace.selling_price = 20000000;

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