import {Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Subscription} from "rxjs";
import {RestService} from "../../services/rest.service";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";
import {TestnetScript} from "../../data/testnet/testnet-script";

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
        if (globalThis.wallet.sending_wal_addrs.length > 0) {
            globalThis.wallet.script = new TestnetScript();
            globalThis.wallet.script.NftMinter.receiver_payment_addr = globalThis.wallet.sending_wal_addrs[0];
            this.restService.generateRewards(globalThis.customerId, globalThis.wallet)
                .then(res => this.processRewardReturn(res))
                .catch(e => this.handleError(e));
        } else {
            this.errorNotification("Your wallet doesn't have any address to use!  ...?");
        }
    }

    public processRewardReturn(data: any) {
        if (data != null) {
            if (data.msg) {
                this.infoNotification(data.msg);
            }else {
                this.infoNotification(JSON.stringify(data));
            }
        }
    }
}