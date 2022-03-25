import {AfterContentInit, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NotifierService} from "angular-notifier";
import {ModalDirective} from "ngx-bootstrap/modal";
import {MenuItem} from "primeng/api";
import {Router, Routes} from "@angular/router";
import {NotificationComponent} from '../../../common/components/notification/notification.component';
import {WalletService} from "../../../common/services/wallet.service";
import {WelcomeComponent} from "../welcome/welcome.component";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {RewardsComponent} from "../dashboard/rewards/rewards.component";
import {HistoryComponent} from "../dashboard/history/history.component";
import {FeedbackComponent} from "../dashboard/feedback/feedback.component";
import {WalletObserverService} from "../../../common/services/wallet-observer.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'rewardz',
    templateUrl: './rwd-navbar.html',
    styleUrls: ['../../styles/navbar.css'],
})

/**
 * Navigation Bar rewards
 */
export class RwdNavbarComponent extends NotificationComponent implements OnInit, AfterContentInit {
    public userMenu: MenuItem[];
    public connectMenuItem: MenuItem;
    public walletSubstring: string;
    public walletLoaded: boolean = false;
    public walletSubscription: Subscription;
    public isTestNet: boolean = false;

    @ViewChild('connectModal', {static: false}) public connectModal: ModalDirective;

    constructor(public router: Router, public titleService: Title, public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public walletService: WalletService) {
        super(notifierService);
        this.titleService.setTitle("Rewardz");
    }

    ngOnInit() {
        const routes: Routes = [
            {
                path: '',
                redirectTo: '/welcome',
                pathMatch: 'full'
            },
            {
                path: 'welcome',
                component: WelcomeComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                children: [
                    {path: '', redirectTo: 'rewards', pathMatch: 'full'},
                    {path: 'rewards', component: RewardsComponent},
                    {path: 'history', component: HistoryComponent},
                    {path: 'feedback', component: FeedbackComponent}
                ]
            }
        ];
        this.router.resetConfig([...routes]);
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                this.isTestNet = (globalThis.wallet.network === 0);
            }
        );
    }

    ngAfterContentInit() {
        this.setupMenu();
        this.disconnectWallet();
        this.getScreenSize(null);
    }

    public openNami() {
        window.open("https://namiwallet.io/", "_blank");
    }

    public openFlint() {
        window.open("https://www.dcspark.io/", "_blank");
    }

    public openCCVault() {
        window.open("https://ccvault.io/app/mainnet/welcome", "_blank");
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
        this.connectModal.show();
    }

    public hideConnectModal() {
        this.connectModal.hide();
    }

    public connected(): boolean {
        return (globalThis.wallet != null);
    }

    public ccvaultAvailable(): boolean {
        return this.walletService.ccvaultAvailable();
    }

    public connectCCVault() {
        const error = this.walletService.connectCCVault();
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
}