import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {NotificationComponent} from "../../notification/notification.component";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {WalletObserverService} from "../../../services/observers/wallet-observer.service";
import {NotifierService} from "angular-notifier";
import {WalletService} from "../../../services/wallet.service";
import {DOCUMENT} from "@angular/common";
import {PropertyService} from "../../../services/property.service";
import {PropertyObserverService} from "../../../services/observers/property-observer.service";
import {Subscription} from "rxjs";
import {RestService} from "../../../services/rest.service";
import {Script} from "../../../data/script";
import {SpoRewardClaim} from "../../../data/spo-reward-claim";
import {WalletVerification} from "../../../data/wallet-verification";

@Component({
    selector: 'bank-manager',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './bank-manager.html'
})
@Injectable()
export class BankManagerComponent extends NotificationComponent implements OnInit {
    public fullScreen: boolean = false;
    public docElem: any;
    public meldHomepage: string = null;
    public logoClickCount = 0;
    public propertySubscription: Subscription;
    public walletLoaded: boolean = false;
    public walletLoading: boolean = false;
    public setWalletLoading: boolean = false;
    public invalidAddress: boolean = true;
    public manualAddress: string = null;
    public walletAddress: string = "";
    public shortWalletAddress: string = "";
    public requiresVerification: boolean = false;
    public checkingVerification: boolean = false;
    public walletVerified: boolean = false;
    public isMinting: boolean = false;
    public walletSubscription: Subscription;
    public walletErrorSubscription: Subscription;

    constructor(@Inject(DOCUMENT) public document: any,
                public router: Router, public titleService: Title, public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public walletService: WalletService,
                public propertyObserver: PropertyObserverService, public restService: RestService) {
        super(notifierService);
        titleService.setTitle("Meld Bank Manager");
    }

    ngOnInit() {
        this.docElem = this.document.documentElement;
        this.propertySubscription = this.propertyObserver.propertyMapSubject.subscribe(propertyMap => {
            this.processProperties(propertyMap);
        });
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (!loaded) {
                    if (this.setWalletLoading) {
                        this.walletLoading = true;
                    }
                    this.setWalletLoading = false;
                } else {
                    this.walletLoading = false;
                    this.verifyWallet();
                }
            }
        );

        this.walletErrorSubscription = this.walletObserverService.error$.subscribe(
            error => {
                this.walletLoaded = false;
                this.errorNotification(error);
                this.disconnectWallet();
            }
        );
        this.processProperties(this.propertyObserver.propertyMap);
    }

    disconnectWallet() {
        this.walletObserverService.setShowConnect(false);
    }

    processProperties(propertyMap: Map<string, string>) {
        if (propertyMap.has(PropertyService.MELD_HOMEPAGE)) {
            this.meldHomepage = propertyMap.get(PropertyService.MELD_HOMEPAGE);
        }
    }

    public verifyWallet() {
        // Verify the wallet
        if (!this.checkingVerification) {
            this.checkingVerification = true;
            globalThis.wallet.script = new Script(null);
            const walletVerScript = new WalletVerification(null);
            for (let i = 0; i < globalThis.wallet.sending_wal_addrs; ++i) {
                walletVerScript.wallet_addresses.push(globalThis.wallet.sending_wal_addrs[i]);
            }
            globalThis.wallet.script.WalletVerification = walletVerScript;
            this.restService.walletVerification()
                .then(res => {
                    if (res.msg) {
                        this.showError(res.msg);
                    } else {
                        this.processVerification(res);
                    }
                })
                .catch(e => this.processError(e));
        }
    }

    public processVerification(res: string) {
        this.walletVerified = (res === "true");
        this.checkingVerification = false;
    }

    toggleFullScreen() {
        if (this.logoClickCount++ === 0) {
            setTimeout(() => {
                if (this.logoClickCount > 1) {
                    if (this.fullScreen) {
                        this.closeFullscreen();
                    } else {
                        this.openFullscreen();
                    }
                } else if (this.meldHomepage != null) {
                    window.open(this.meldHomepage);
                } else {
                    this.warnNotification("Meld homepage isn't set!");
                }
                this.logoClickCount = 0;
            }, 250);
        }
    }

    openFullscreen() {
        this.fullScreen = true;
        if (this.docElem.requestFullscreen) {
            this.docElem.requestFullscreen();
        } else if (this.docElem.mozRequestFullScreen) {
            /* Firefox */
            this.docElem.mozRequestFullScreen();
        } else if (this.docElem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.docElem.webkitRequestFullscreen();
        } else if (this.docElem.msRequestFullscreen) {
            /* IE/Edge */
            this.docElem.msRequestFullscreen();
        }
    }

    /* Close fullscreen */
    closeFullscreen() {
        this.fullScreen = false;
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
    }

    public routeSmartClaimz() {
        window.open("http://flz.smartclaimz.io:4200");
    }

    public connectWallet() {
        this.setWalletLoading = true;
        this.walletObserverService.setShowConnect(true);
    }

    public mintBankManager() {
        this.isMinting = true;
    }

    public showError(error) {
        this.checkingVerification = false;
        this.requiresVerification = true;
        this.errorNotification(error);
    }

    public processError(error) {
        this.checkingVerification = false;
        this.requiresVerification = true;
        this.handleError(error);
    }

    public checkAddress() {
        if (this.manualAddress != null) {
            if (!this.manualAddress.startsWith("addr1")) {
                this.invalidAddress = true;
            } else if (this.manualAddress.length !== 103) {
                this.invalidAddress = true;
            } else {
                this.invalidAddress = false;
            }
            if (!this.invalidAddress) {

            }
        } else {
            this.invalidAddress = true;
        }
    }
}