import {Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Subscription} from "rxjs";
import {RestService} from "../../services/rest.service";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'testnet',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './testnet.html',
})
@Injectable()
/**
 *
 */
export class TestnetComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;

    constructor(public walletObserverService: WalletObserverService, public walletService: WalletService,
                public restService: RestService, public notifierService: NotifierService) {
        super(notifierService);
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }

    public generateRewards() {
        this.restService.generateRewards(globalThis.customerId, globalThis.multiSigType)
            .catch(e => this.handleError(e));
    }
}