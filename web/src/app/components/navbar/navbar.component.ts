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
    public walletMenu: MenuItem;
    public helpMenu: MenuItem[];
    public faqMenuItem: MenuItem;
    public contactUsMenuItem: MenuItem;
    public tokenMetadataMenuItem: MenuItem;
    public compressMenu: boolean = false;
    public connected: boolean = false;
    public walletSubstring: string;
    public walletImage: string;
    public walletLoaded: boolean = false;
    public walletSubscription: Subscription;
    public walletErrorSubscription: Subscription;
    public isTestNet: boolean = false;
    public screenWidth: number;
    public screenHeight: number;
    public fullScreen: boolean = false;
    public docElem: any;
    @ViewChild('connectModal', {static: false}) public connectModal: ModalDirective;

    constructor(@Inject(DOCUMENT) public document: any, public httpClient: HttpClient,
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
        this.walletMenu = {
            label: this.getWalletSubstring(),
            title: 'Disconnect wallet',
            id: 'DISCONNECT',
            icon: 'fa-solid fa-wallet',
            command: (event) => {
                this.disconnectWallet();
            }
        };

        this.connectMenuItem = [{
            label: 'CONNECT',
            id: 'CONNECT',
            title: 'Connect wallet',
            icon: 'fa-solid fa-wallet',
            command: (event) => {
                this.showConnectModal();
            }
        }];
        this.claimzMenuItem = {
            label: 'CLAIMZ',
            id: 'CLAIMZ',
            title: 'Claim your available rewards',
            icon: 'fa-solid fa-bolt-lightning',
            command: (event) => {
                this.showCollectRewards();
            }
        };
        this.historicalMenuItem = {
            label: 'HISTORICAL',
            id: 'HISTORICAL',
            title: 'See historical claimz',
            icon: 'fa-solid fa-clock-rotate-left',
            command: (event) => {
                this.showHistory();
            }
        };
        this.rewardsMenu = [{
            label: 'REWARDS',
            id: 'REWARDS',
            title: 'Claim or see historical rewards',
            icon: 'fa-solid fa-coins',
            items: [this.claimzMenuItem,
                this.historicalMenuItem]
        }];
        this.testnetMenu = {
            label: 'TESTNET',
            id: 'TESTNET',
            title: 'Tools for testnet testing',
            icon: 'fa-solid fa-toolbox',
            command: (event) => {
                this.routeTestnet();
            }
        };
        this.faqMenuItem = {
            label: 'FAQ',
            id: 'FAQ',
            title: 'Frequently asked questions',
            icon: 'fa-solid fa-circle-question',
            command: (event) => {
                this.routeFaq();
            }
        };
        this.contactUsMenuItem = {
            label: 'CONTACT US',
            id: 'CONTACTUS',
            title: 'Send feedback or questions',
            icon: 'fa-solid fa-message ',
            command: (event) => {
                this.routeContactUs();
            }
        };

        this.tokenMetadataMenuItem = {
            label: 'EXPLORE',
            id: 'TOKENMETADATA',
            title: 'Find all listed tokens',
            icon: 'fa-solid fa-compass',
            command: (event) => {
                this.routeTokenMetadata();
            }
        };

        if (!this.isTestNet) {
            this.helpMenu = [{
                label: 'HELP',
                id: 'HELP',
                title: 'Contact us, FAQ',
                icon: 'fa-solid fa-circle-info',
                items: [
                    this.contactUsMenuItem,
                    this.faqMenuItem,
                    this.tokenMetadataMenuItem]
            }];
            this.collapsedConnectedMenu = [
                this.claimzMenuItem,
                this.historicalMenuItem,
                this.contactUsMenuItem,
                this.faqMenuItem,
                this.tokenMetadataMenuItem];
            this.collapsedMenu = [
                this.connectMenuItem[0],
                this.contactUsMenuItem,
                this.faqMenuItem,
                this.tokenMetadataMenuItem];
        } else {
            this.helpMenu = [{
                label: 'HELP',
                id: 'HELP',
                title: 'Contact us, FAQ, Testnet tools',
                icon: 'fa-solid fa-circle-info',
                items: [this.contactUsMenuItem,
                    this.faqMenuItem,
                    this.tokenMetadataMenuItem,
                    this.testnetMenu]
            }];
            this.collapsedConnectedMenu = [
                this.claimzMenuItem,
                this.historicalMenuItem,
                this.contactUsMenuItem,
                this.faqMenuItem,
                this.tokenMetadataMenuItem,
                this.testnetMenu];
            this.collapsedMenu = [
                this.connectMenuItem[0],
                this.contactUsMenuItem,
                this.faqMenuItem,
                this.tokenMetadataMenuItem,
                this.testnetMenu
            ];
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        if (globalThis.screenWidth <= 960) {
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
        this.connectModal.show();
    }

    public hideConnectModal() {
        this.connectModal.hide();
    }

    public eternlAvailable(): boolean {
        return this.walletService.eternlAvailable();
    }

    public connectEternl() {
        this.connected = true;
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
        this.connected = true;
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
        this.connected = true;
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
        this.connected = true;
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
        this.router.navigate(['/rewards']);
    }

    public showHistory() {
        this.router.navigate(['/history']);

    }

    public routeContactUs() {
        this.router.navigate(['/contact-us']);
    }

    public routeFaq() {
        this.router.navigate(['/faq']);
    }

    public routeRewards() {
        this.router.navigate(['/rewards']);
    }

    public routeTokenMetadata() {
        this.router.navigate(['/explore']);
    }

    public routeTestnet() {
        this.router.navigate(['/testnet']);
    }

    public anyWalletAvailable(): boolean {
        return this.walletService.anyWalletAvailable();
    }

    public disconnectWallet() {
        globalThis.walletApi = null;
        globalThis.wallet = null;
        this.walletSubstring = null;
        this.connected = false;
        this.walletObserverService.setloaded(false);
        this.router.navigate(['/welcome']);
    }

    public getWalletSubstring() {
        return this.walletService.getWalletSubstring();
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

    scrollToElement(element): void {
        this.document.getElementById(element).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
}