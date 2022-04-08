import {Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {Subscription} from "rxjs";

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

    public setNetwork() {
        if (globalThis.wallet.network === 0) {
            this.network = "testnet";
        } else {
            this.network = "mainnet";
        }
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }
}