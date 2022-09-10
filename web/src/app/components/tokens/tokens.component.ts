import {Component, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {RestService} from "../../services/rest.service";
import {Title} from "@angular/platform-browser";
import {Pool} from "../../data/pool";
import {TokenService} from "../../services/token.service";
import {Token} from "../../data/token";

@Component({
    selector: 'tokens',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: 'tokens.html'
})

export class TokensComponent extends NotificationComponent implements OnInit, OnDestroy {
    public tokens: Array<Token> = [];
    public maxItems: number = 10;
    public showPaging: boolean = false;
    public initialized: boolean = false;
    public listingTokens: boolean = false;
    public gridItemWidth: number = 300;
    public gridItemHeight: number = 300;
    public gridItemSmallWidth: number = 260;
    public gridItemSmallHeight: number = 260;
    public smallGrid: boolean = false;
    public isPreview: boolean = false;
    @ViewChild('tokenView', {static: false}) public tokenView: any;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public notifierService: NotifierService, public restService: RestService,
                public titleService: Title, public tokenService: TokenService) {
        super(notifierService);
        if (globalThis.tokens == null) {
            globalThis.tokens = [];
        }

        this.titleService.setTitle("Tokens");
    }

    public ngOnInit() {
        this.getScreenSize(null);
        this.listTokens();
    }

    public ngOnDestroy() {
    }

    public tokensLoaded() {
        return TokenService.finished;
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        let usableWidth = globalThis.screenWidth * .75;
        const usableHeight = globalThis.screenHeight * .75;
        this.smallGrid = false;
        if (globalThis.screenHeight < 500) {
            this.smallGrid = true;
        }
        if (globalThis.screenWidth < 900) {
            this.smallGrid = true;
            usableWidth = globalThis.screenWidth * .95;
        }
        if (this.smallGrid) {
            const maxPerRow = Math.floor(usableWidth / this.gridItemSmallWidth);
            const maxVisableRows = Math.floor(usableHeight / this.gridItemSmallHeight);
            this.maxItems = +maxPerRow * +maxVisableRows;
        } else {
            const maxPerRow = Math.floor(usableWidth / this.gridItemWidth);
            const maxVisableRows = Math.floor(usableHeight / this.gridItemHeight);
            this.maxItems = +maxPerRow * +maxVisableRows;
        }
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.getScreenSize(event);
    }

    public listTokens() {
        this.listingTokens = true;
        globalThis.tokens = [];
        if (!this.isPreview) {
            this.processTokenList(TokenService.tokenList);
        }
    }

    public processTokenList(data: any) {
        globalThis.tokens = [];
        for (let i = 0; i < data.length; ++i) {
            const newToken = new Token(data[i]);
            globalThis.tokens.push(newToken);
        }
        globalThis.tokens.sort((a, b) => Pool.sort(a, b));
        this.tokens = [...globalThis.tokens];
        this.initialized = true;
        this.listingTokens = false;
        this.getScreenSize(null);
    }

    public filterDataView(filter: string) {
        this.tokenView.filter(filter);
    }

    public explore(token: Token) {
        console.log(token);
    }
}