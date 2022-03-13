import {Component, OnInit} from '@angular/core';
import {NotificationComponent} from "../common/notification.component";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {Wallet} from "../../data/wallet";
import {RestService} from "../../services/rest.service";
import {WalletObserverService} from "../../services/wallet-observer.service";

@Component({
    selector: 'dashboard',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends NotificationComponent implements OnInit {

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public walletObserver: WalletObserverService) {
        super(notifierService);
    }

    public ngOnInit() {
        if (globalThis.walletApi == null) {
            this.router.navigate(['/welcome']);
        }
        /**
         * https://cips.cardano.org/cips/cip30/
         */
        globalThis.wallet = new Wallet(null);
        globalThis.walletApi.getNetworkId()
            .then(data => this.processNetworkId(data))
            .catch(e => this.handleError(e));
    }

    private processNetworkId(data: any) {
        console.log("processNetworkId");
        console.log(data);
        globalThis.wallet.network = data;
        globalThis.walletApi.getRewardAddresses()
            .then(res => this.processRewardAddresses(res))
            .catch(e => this.handleError(e));
    }

    private processRewardAddresses(data: any) {
        console.log("processRewardAddresses");
        console.log(data);
        globalThis.walletApi.getUtxos()
            .then(res => this.processUtxos(res))
            .catch(e => this.handleError(e));
    }

    private processUtxos(data: any) {
        console.log("processUtxos");
        console.log(data);
        globalThis.walletApi.getUnusedAddresses()
            .then(res => this.processUnusedAddresses(res))
            .catch(e => this.handleError(e));

    }

    private processUnusedAddresses(data: any) {
        console.log("processUnusedAddresses");
        console.log(data);
        globalThis.walletApi.experimental.getCollateral()
            .then(res => this.processCollateral(res))
            .catch(e => this.handleError(e));

    }

    private processCollateral(data: any) {
        console.log("processCollateral");
        console.log(data);
        globalThis.walletApi.getBalance()
            .then(res => this.processBalance(res))
            .catch(e => this.handleError(e));
    }

    private processBalance(data: any) {
        console.log("processBalance");
        console.log(data);
        globalThis.wallet.balance = data;
        this.walletObserver.setloaded(true);
    }


    public showCollectRewards() {
        this.router.navigate(['/dashboard/rewards']);
    }

    public showHistory() {
        this.router.navigate(['/dashboard/history']);

    }

    public showFeedback() {
        this.router.navigate(['/dashboard/feedback']);

    }
}