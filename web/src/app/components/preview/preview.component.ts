import {Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Subscription} from "rxjs";
import {RestService} from "../../services/rest.service";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";
import {PreviewScript} from "../../data/preview/preview-script";

@Component({
    selector: 'preview',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './preview.html',
})
@Injectable()
/**
 *
 */
export class PreviewComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    public submitted: boolean = false;
    public isPreview: boolean = false;

    constructor(public walletObserverService: WalletObserverService, public walletService: WalletService,
                public restService: RestService, public notifierService: NotifierService) {
        super(notifierService);
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (loaded) {
                    this.setNetwork();
                } else {
                    this.isPreview = false;
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        if (this.walletLoaded) {
            this.setNetwork();
        }
    }

    public setNetwork() {
        if (globalThis.wallet.network === 0) {
            this.isPreview = true;
        } else {
            this.isPreview = false;
        }
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }

    public disableGenRewards(): boolean {
        if ((!this.walletLoaded) || (this.submitted)) {
            return true;
        }
        return false;
    }

    public generateRewards() {
        if (globalThis.wallet.sending_wal_addrs.length > 0) {
            globalThis.wallet.script = new PreviewScript();
            globalThis.wallet.script.NftMinter.receiver_payment_addr = globalThis.wallet.sending_wal_addrs[0];
            // globalThis.wallet.contract_id = 111;
            this.submitted = true;
            this.restService.generateRewards(globalThis.customerId, globalThis.wallet)
                .then(res => this.processRewardReturn(res))
                .catch(e => this.processError(e));
        } else {
            this.errorNotification("Your wallet doesn't have any address to use!");
        }
    }

    public processRewardReturn(data: any) {
        this.submitted = false;
        if (data != null) {
            if (data.msg) {
                if (data.msg !== 'connection reset by server') {
                    this.successNotification(data.msg);
                } else {
                    this.errorNotification("Error occured. Please wait a minute and try your request again");
                }
            } else {
                this.infoNotification(JSON.stringify(data));
            }
        }
    }

    public processError(e: any) {
        this.submitted = false;
        this.handleError(e);
    }
}