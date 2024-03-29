import {Component, Injectable, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {WalletObserverService} from "../../services/observers/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Subscription} from "rxjs";
import {ModalDirective} from "ngx-bootstrap/modal";

@Component({
    selector: 'network',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './network.html',
})
@Injectable()
/**
 *
 */
export class NetworkComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public network: string = "";
    public backgroundIndex: number = 0;
    @ViewChild('terms', {static: false}) public terms: ModalDirective;

    constructor(public walletObserverService: WalletObserverService, public walletService: WalletService) {
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                if (loaded === true) {
                    this.setNetwork();
                } else {
                    this.network = "";
                }
            }
        );
        if (this.walletService.walletLoaded) {
            this.setNetwork();
        }
    }

    public showTermsModal() {
        this.terms.show();
    }

    public downloadModal() {
        this.hideTermsModal(null);
        window.open('assets/SmartClaimz-Terms_of_Service.pdf');
    }

    public hideTermsModal(event: any) {
        this.terms.hide();
    }

    public setNetwork() {
        if (globalThis.wallet.network === 0) {
            this.network = "preview";
        } else if (globalThis.wallet.network === 1) {
            this.network = "mainnet";
        } else {
            this.network = "unknown";
        }
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }
}