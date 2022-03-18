import {AfterContentInit, Component, HostListener, Inject, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NotifierService} from "angular-notifier";
import {DOCUMENT} from '@angular/common';
import {ModalDirective} from "ngx-bootstrap/modal";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {NotificationComponent} from '../common/notification.component';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['../../../styles/navbar.css'],
})

/**
 * Navigation Bar rewards
 */
export class NavbarComponent extends NotificationComponent implements AfterContentInit {
    public userMenu: MenuItem[];
    public connectMenuItem: MenuItem;
    public walletSubstring: string;
    @ViewChild('connectModal', {static: false}) public connectModal: ModalDirective;

    constructor(@Inject(DOCUMENT) private document: any, public router: Router, public titleService: Title,
                public notifierService: NotifierService) {
        super(notifierService);
        globalThis.wallet = null;
        globalThis.walletApi = null;
    }

    ngAfterContentInit() {
        this.setupMenu();
        this.disconnectWallet();
        this.getScreenSize(null);
    }

    public setupMenu() {
        this.connectMenuItem = {
            label: 'Connect',
            id: 'Connect',
            icon: 'fas fa-sign-in-alt',
            command: (event) => {
                this.showConnectModal();
            }
        };
        if (!this.connected()) {
            this.userMenu = [{
                label: 'Connect Wallet',
                id: 'UserMenu',
                icon: 'fas fa-user',
                items: [this.connectMenuItem
                ]
            }];
        } else {
            this.userMenu = [{
                label: 'Wallet Connected',
                id: 'UserMenu',
                icon: 'fas fa-user',
                items: [this.connectMenuItem
                ]
            }];
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }

    public showConnectModal() {
        this.connectModal.show();
    }

    public hideConnectModal() {
        this.connectModal.hide();
    }

    public connected(): boolean {
        return (globalThis.wallet != null);
    }

    public ccvaultAvailable(): boolean {
        return (globalThis.cardano.ccvault != null);
    }

    public connectCCVault() {
        if (globalThis.cardano.ccvault != null) {
            globalThis.cardano.ccvault.enable().then((api) => {
                    this.finishWalletConnect(api, "nami");
                }
            ).catch((e) => {
                this.errorNotification("Could not connect with CCVault!");
            });
        } else {
            this.errorNotification("CCVault extension not installed");
        }
    }

    public namiAvailable(): boolean {
        return (globalThis.cardano.nami != null);
    }

    public connectNami() {
        if (globalThis.cardano.nami != null) {
            globalThis.cardano.nami.enable().then((api) => {
                    this.finishWalletConnect(api, "nami");
                }
            ).catch((e) => {
                this.errorNotification("Could not connect with Nami!");
            });
        } else {
            this.errorNotification("Nami extension not installed");
        }
    }

    // Gero Wallet
    public connectGero() {
        if (globalThis.cardano.gero != null) {
            globalThis.cardano.gero.enable().then((api) => {
                    this.finishWalletConnect(api, "gero");
                }
            ).catch((e) => {
                this.errorNotification("Could not connect with Gero!");
            });
        } else {
            this.errorNotification("Gero extension not installed");
        }
    }

    public geroAvailable(): boolean {
        return (globalThis.cardano.gero != null);
    }


    // Flint
    public connectFlint() {
        if (globalThis.cardano.flint != null) {
            globalThis.cardano.flint.enable().then((api) => {
                    this.finishWalletConnect(api, "flint");
                }
            ).catch((e) => {
                this.errorNotification("Could not connect with flint!");
            });
        } else {
            this.errorNotification("Flint extension not installed");
        }

    }

    public flintAvailable(): boolean {
        return (globalThis.cardano.flint != null);
    }

    public finishWalletConnect(api: any, source: string) {
        if (api != null) {
            console.log(api);
            this.hideConnectModal();
            globalThis.wallet = source;
            globalThis.walletApi = api;
            this.router.navigate(['/dashboard']);
        }
    }

    public anyWalletAvailable(): boolean {
        if ((this.ccvaultAvailable()) ||
            (this.namiAvailable()) ||
            (this.flintAvailable()) ||
            (this.geroAvailable())) {
            return true;
        }
        return false;
    }

    public disconnectWallet() {
        globalThis.walletApi = null;
        globalThis.wallet = null;
        this.walletSubstring = null;
        this.router.navigate(['/welcome']);
    }

    public getWalletSubstring() {
        if (this.walletSubstring != null) {
            return this.walletSubstring;
        } else if ((globalThis.wallet != null) && (globalThis.wallet.sending_stake_addr != null)) {
            const toEndOfString = globalThis.wallet.sending_stake_addr.length - 5;
            this.walletSubstring = globalThis.wallet.sending_stake_addr.substring(0, 5)
                .concat("...")
                .concat(globalThis.wallet.sending_stake_addr.substring(toEndOfString));
            return this.walletSubstring;
        }
        return "";
    }
}