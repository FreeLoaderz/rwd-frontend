import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {NotificationComponent} from "../../notification/notification.component";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {WalletObserverService} from "../../../services/observers/wallet-observer.service";
import {NotifierService} from "angular-notifier";
import {WalletService} from "../../../services/wallet.service";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'bank-manager',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './bank-manager.html'
})
@Injectable()
export class BankManagerComponent extends NotificationComponent implements OnInit {
    public fullScreen: boolean = false;
    public docElem: any;
    public logoClickCount = 0;

    constructor(@Inject(DOCUMENT) public document: any,
                public router: Router, public titleService: Title, public walletObserverService: WalletObserverService,
                public notifierService: NotifierService, public walletService: WalletService) {
        super(notifierService);
        titleService.setTitle("Meld Bank Manager");
    }

    ngOnInit() {
        this.docElem = this.document.documentElement;
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
                } else {
                    window.open('https://meld.io');
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
}