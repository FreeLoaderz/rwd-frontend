import {Component, OnInit} from "@angular/core";
import {NotificationComponent} from "../../../../common/components/notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../../../common/services/rest.service";
import {AvailableTokens} from "../../../../common/data/available-tokens";
import {Observable, Subscription} from "rxjs";
import {WalletObserverService} from "../../../../common/services/wallet-observer.service";

@Component({
    selector: 'rewards',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './rewards.html'
})

export class RewardsComponent extends NotificationComponent implements OnInit {
    public walletSubscription: Subscription;
    public claimSubscription: Subscription;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserverService: WalletObserverService) {
        super(notifierService);

    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.listTokens();
            }
        );
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
        this.restService.claimTokens()
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
}