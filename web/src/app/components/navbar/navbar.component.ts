import {AfterContentInit, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NotifierService} from "angular-notifier";
import {ModalDirective} from "ngx-bootstrap/modal";
import {MenuItem} from "primeng/api";
import {NavigationEnd, Router} from "@angular/router";
import {NotificationComponent} from '../notification/notification.component';
import {WalletService} from "../../services/wallet.service";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {TokenMetadata} from "../../data/token-metadata";
import {TokenMetadataService} from "../../services/token-metadata.service";
import {HttpClient} from "@angular/common/http";

declare let gtag: Function;

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['../../../styles/navbar.css'],
})

/**
 * Navigation Bar rewards
 */
export class NavbarComponent extends NotificationComponent implements OnInit, AfterContentInit {
    public userMenu: MenuItem[];
    public connectMenuItem: MenuItem;
    public walletSubstring: string;
    public walletLoaded: boolean = false;
    public walletSubscription: Subscription;
    public walletErrorSubscription: Subscription;
    public isTestNet: boolean = false;
    public isMenuCollapsed: boolean = true;
    public screenWidth: number;
    public screenHeight: number;
    public fullScreen: boolean = false;
    public docElem: any;
    @ViewChild('connectModal', {static: false}) public connectModal: ModalDirective;

    constructor(@Inject(DOCUMENT) private document: any, public httpClient: HttpClient,
                public router: Router, public titleService: Title, public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public walletService: WalletService,
                public tokenMetadataService: TokenMetadataService) {
        super(notifierService);
        this.titleService.setTitle("Rewards");
        this.router.events.subscribe(event => {
            if ((event instanceof NavigationEnd) && (location.host === 'rwd.freeloaderz.io')) {
                gtag('set', 'page_path', event.urlAfterRedirects);
                gtag('event', 'page_view');
            }
        });
    }

    ngOnInit() {
        this.tokenMetadataService.init();
        this.docElem = this.document.documentElement;
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                this.isTestNet = (globalThis.wallet.network === 0);
            }
        );

        this.walletErrorSubscription = this.walletObserverService.error$.subscribe(
            error => {
                this.walletLoaded = false;
                this.errorNotification("Wallet could not be loaded! Make sure DApp access is enabled!");
                this.disconnectWallet();
            }
        );
        this.httpClient.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
            globalThis.ipAddress = res.ip;
        });
    }

    ngAfterContentInit() {
        this.setupMenu();
        this.disconnectWallet();
        this.getScreenSize(null);
        globalThis.customerId = 1;
        globalThis.multiSigType = "sporwc";
    }

    public openNami() {
        window.open("https://namiwallet.io/", "_blank");
    }

    public openFlint() {
        window.open("https://www.dcspark.io/", "_blank");
    }

    public openEternl() {
        window.open("https://eternl.io/app/mainnet/welcome", "_blank");
    }

    public openGero() {
        window.open("https://gerowallet.io/", "_blank");
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
        this.isMenuCollapsed = true;
        this.connectModal.show();
    }

    public hideConnectModal() {
        this.connectModal.hide();
    }

    public connected(): boolean {
        return (globalThis.wallet != null);
    }

    public eternlAvailable(): boolean {
        return this.walletService.eternlAvailable();
    }

    public connectEternl() {
        const error = this.walletService.connectEternl();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.hideConnectModal();
            this.router.navigate(['/dashboard']);
        }
    }

    public namiAvailable(): boolean {
        return this.walletService.namiAvailable();
    }

    public connectNami() {
        const error = this.walletService.connectNami();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.hideConnectModal();
            this.router.navigate(['/dashboard']);
        }
    }

    // Gero Wallet
    public connectGero() {
        const error = this.walletService.connectGero();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.hideConnectModal();
            this.router.navigate(['/dashboard']);
        }
    }

    public geroAvailable(): boolean {
        return this.walletService.geroAvailable();
    }


    // Flint
    public connectFlint() {
        const error = this.walletService.connectFlint();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.hideConnectModal();
            this.router.navigate(['/dashboard']);
        }
    }

    public flintAvailable(): boolean {
        return this.walletService.flintAvailable();
    }

    public routeContactUs() {
        this.isMenuCollapsed = true;
        this.setActive("CONTACTUS");
        this.router.navigate(['/contact-us']);
    }

    public routeFaq() {
        this.isMenuCollapsed = true;
        this.setActive("FAQ");
        this.router.navigate(['/faq']);
    }

    public routeRewards() {
        this.isMenuCollapsed = true;
        this.setActive("REWARDS");
        this.router.navigate(['/dashboard']);
    }

    public routeTokenMetadata() {
        this.isMenuCollapsed = true;
        this.setActive("TOKENMETADATA");
        this.router.navigate(['/explore'])
    }

    public routeTestnet() {
        this.isMenuCollapsed = true;
        this.setActive("TESTNET");
        this.router.navigate(['/testnet']);
    }

    public anyWalletAvailable(): boolean {
        return this.walletService.anyWalletAvailable();
    }

    public disconnectWallet() {
        globalThis.walletApi = null;
        globalThis.wallet = null;
        this.walletSubstring = null;
        this.router.navigate(['/welcome']);
    }

    public getWalletSubstring() {
        return this.walletService.getWalletSubstring();
    }


    public setActive(sourceId: string) {
        this.isMenuCollapsed = true;
        if (this.connected()) {
            this.document.getElementById("REWARDS").classList.remove("nav-active");
            if (this.isTestNet) {
                this.document.getElementById("TESTNET").classList.remove("nav-active");
            }
        }
        this.document.getElementById("CONTACTUS").classList.remove("nav-active");
        this.document.getElementById("TOKENMETADATA").classList.remove("nav-active");
        this.document.getElementById("FAQ").classList.remove("nav-active");
        if (sourceId != null) {
            this.document.getElementById(sourceId).classList.add("nav-active");
        }
    }

    toggleFullScreen() {
        if (this.fullScreen) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
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

}