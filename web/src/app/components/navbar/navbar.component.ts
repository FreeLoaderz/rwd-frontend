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
import {HttpClient} from "@angular/common/http";

declare let gtag: Function;

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html',
    styleUrls: ['../../../styles/navbar.css'],
})

/**
 * Navigation Bar
 */
export class NavbarComponent extends NotificationComponent implements OnInit, AfterContentInit {
    public collapsedConnectedMenu: MenuItem[];
    public collapsedMenu: MenuItem[];
    public rewardsMenu: MenuItem[];
    public claimzMenuItem: MenuItem;
    public historicalMenuItem: MenuItem;
    public connectMenuItem: MenuItem[];
    public testnetMenu: MenuItem;
    public helpMenu: MenuItem[];
    public faqMenuItem: MenuItem;
    public contactUsMenuItem: MenuItem;
    public compressMenu: boolean = false;
    public connected: boolean = false;
    public walletSubstring: string;
    public walletImage: string;
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
                public notifierService: NotifierService, public walletService: WalletService) {
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
        this.docElem = this.document.documentElement;
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.isTestNet = (globalThis.wallet.network === 0);
                this.setupMenu();
                this.connected = loaded;
                this.walletLoaded = loaded;
            }
        );

        this.walletErrorSubscription = this.walletObserverService.error$.subscribe(
            error => {
                this.walletLoaded = false;
                this.errorNotification(error);
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
        this.connectMenuItem = [{
            label: 'Connect',
            id: 'CONNECT',
            icon: 'fa-solid fa-wallet',
            command: (event) => {
                this.showConnectModal();
            }
        }];
        this.claimzMenuItem = {
            label: 'Claimz',
            id: 'CLAIMZ',
            icon: 'fa-solid fa-coins',
            command: (event) => {
                this.showCollectRewards();
            }
        };
        this.historicalMenuItem = {
            label: 'Historical',
            id: 'HISTORICAL',
            icon: 'fa-solid fa-clock-rotate-left',
            command: (event) => {
                this.showHistory();
            }
        };
        this.rewardsMenu = [{
            label: 'Rewards',
            id: 'REWARDS',
            icon: 'fa-solid fa-coins',
            items: [this.claimzMenuItem,
                this.historicalMenuItem]
        }];
        this.testnetMenu = {
            label: 'Testnet',
            id: 'TESTNET',
            icon: 'fa-solid fa-toolbox',
            command: (event) => {
                this.routeTestnet();
            }
        };
        this.faqMenuItem = {
            label: 'FAQ',
            id: 'FAQ',
            icon: 'fa-solid fa-circle-question',
            command: (event) => {
                this.routeFaq();
            }
        };
        this.contactUsMenuItem = {
            label: 'Contact Us',
            id: 'CONTACTUS',
            icon: 'fa-solid fa-message ',
            command: (event) => {
                this.routeContactUs();
            }
        };

        if (!this.isTestNet) {
            this.helpMenu = [{
                label: 'Help',
                id: 'HELP',
                icon: 'fa-solid fa-circle-question',
                items: [this.contactUsMenuItem,
                    this.faqMenuItem]
            }];
            this.collapsedConnectedMenu = [{
                id: 'CompressedMenu',
                icon: 'fas fa-bars',
                items: [
                    this.claimzMenuItem,
                    this.historicalMenuItem,
                    this.contactUsMenuItem,
                    this.faqMenuItem]
            }];
            this.collapsedMenu = [{
                id: 'CompressedMenu',
                icon: 'fas fa-bars',
                items: [
                    this.connectMenuItem[0],
                    this.contactUsMenuItem,
                    this.faqMenuItem]
            }];
        } else {
            this.helpMenu = [{
                label: 'Help',
                id: 'HELP',
                icon: 'fa-solid fa-circle-question',
                items: [this.contactUsMenuItem,
                    this.faqMenuItem,
                    this.testnetMenu]
            }];
            this.collapsedConnectedMenu = [{
                id: 'CompressedMenu',
                icon: 'fas fa-bars',
                items: [
                    this.claimzMenuItem,
                    this.historicalMenuItem,
                    this.contactUsMenuItem,
                    this.faqMenuItem,
                    this.testnetMenu]
            }];
            this.collapsedMenu = [{
                id: 'CompressedMenu',
                icon: 'fas fa-bars',
                items: [
                    this.connectMenuItem[0],
                    this.contactUsMenuItem,
                    this.faqMenuItem,
                    this.testnetMenu]
            }];
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        if (globalThis.screenWidth < 1024) {
            this.compressMenu = true;
        } else {
            this.compressMenu = false;
        }
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

    public eternlAvailable(): boolean {
        return this.walletService.eternlAvailable();
    }

    public connectEternl() {
        const error = this.walletService.connectEternl();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.walletImage = "../../assets/icons/eternl.png";
            this.hideConnectModal();
            this.router.navigate(['/rewards']);
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
            this.walletImage = "../../assets/icons/nami.png";
            this.hideConnectModal();
            this.router.navigate(['/rewards']);
        }
    }

    // Gero Wallet
    public connectGero() {
        const error = this.walletService.connectGero();
        if (error != null) {
            this.errorNotification(error);
        } else {
            this.walletImage = "../../assets/icons/gero.png";
            this.hideConnectModal();
            this.router.navigate(['/rewards']);
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
            this.walletImage = "../../assets/icons/flint.png";
            this.hideConnectModal();
            this.router.navigate(['/rewards']);
        }
    }

    public flintAvailable(): boolean {
        return this.walletService.flintAvailable();
    }

    public getWalletSource() {
        return globalThis.walletSource;
    }

    public showCollectRewards() {
        this.setActive("REWARDS");
        this.router.navigate(['/rewards']);
    }

    public showHistory() {
        this.setActive("REWARDS");
        this.router.navigate(['/history']);

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
        this.router.navigate(['/rewards']);
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
        if (this.connected) {
            this.document.getElementById("REWARDS").classList.remove("nav-active");
            if (this.isTestNet) {
                this.document.getElementById("TESTNET").classList.remove("nav-active");
            }
        }
        this.document.getElementById("CONTACTUS").classList.remove("nav-active");
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