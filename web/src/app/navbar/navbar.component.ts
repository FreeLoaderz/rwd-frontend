import {AfterContentInit, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SystemService} from "../common/system.service";
import {WebsocketSubscriber} from "../common/websocket-subscriber";
import {NotifierService} from "angular-notifier";
import {DOCUMENT} from '@angular/common';
import {ModalDirective} from "ngx-bootstrap/modal";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'navbar',
    templateUrl: '../templates/navbar/navbar.html',
    styleUrls: ['../../styles/navbar.css'],
})

/**
 * Navigation Bar components
 */
export class NavbarComponent extends WebsocketSubscriber implements OnInit, AfterContentInit {
    public notificationMessage: string;
    public notificationMessages: Array<string> = [];
    public notificationError: boolean;
    public host: string = "";
    public elem: any;
    public alert: string = "none";
    public userMenu: MenuItem[];
    public loginMenuItem: MenuItem;

    @ViewChild('notificationModal', {static: false}) public notificationModal: ModalDirective;

    constructor(@Inject(DOCUMENT) private document: any, public router: Router, public titleService: Title,
                public systemService: SystemService, public notifierService: NotifierService) {
        super("NavBar", notifierService);
        this.host = location.hostname;
        this.systemService.init();
    }

    /**
     * Init the component
     */
    ngOnInit() {
        this.elem = document.documentElement;
        this.systemService.register(this);
    }

    ngAfterContentInit() {
        this.setupMenu();
        this.getScreenSize(null);
    }

    public setupMenu() {
        this.loginMenuItem = {
            label: 'Login',
            id: 'Login',
            icon: 'fas fa-sign-in-alt',
            command: (event) => {
                this.showLoginModal();
            }
        };
        if (!this.loggedIn()) {
            this.userMenu = [{
                label: '',
                id: 'UserMenu',
                icon: 'fas fa-user',
                items: [this.loginMenuItem
                ]
            }];
        } else {
            this.userMenu = [{
                label: '',
                id: 'UserMenu',
                icon: 'fas fa-user',
                items: [this.loginMenuItem
                ]
            }];
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        SystemService.screenHeight = window.innerHeight;
        SystemService.screenWidth = window.innerWidth;
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }

    public login() {
        this.hideLoginModal();
    }

    public routeToHelp() {

    }

    public routeToDashboard() {

    }

    public routeToGameDay() {

    }

    public loggedIn(): boolean {
   return false;
    }

    /**
     * Show the notification
     * @param message
     * @param error
     */
    public showNotificationModal(message: any, error: any) {
        this.notificationError = error;
        this.notificationMessage = message;
        this.notificationMessages = this.notificationMessage.split("<SPLIT>");
        this.notificationModal.show();
    }

    /**
     * Hide the notification modal
     */
    public hideNotificationModal() {
        this.notificationModal.hide();
    }

    /**
     * Show the download modal
     */
    public showDownloadModal() {
    }

    /**
     * Hide the notification modal
     */
    public hideDownloadModal() {
    }

    public showLoginModal() {

    }


    public hideLoginModal() {
    }

    public signup() {

    }

    public downloadFile() {

    }

    /**
     * Process any data coming through the webSocket
     * @param data
     */
    public processData(data: any) {
        if (data.type === 'SYSTEM') {
            if (data.showDialog === true) {
                this.showNotificationModal(data.message, data.error);
            } else {
                if (data.error === true) {
                    this.errorNotification(data.message);
                } else {
                    this.infoNotification(data.message);
                }
            }
        }
    }
}
