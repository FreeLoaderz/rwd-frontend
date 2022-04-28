import {Component, HostListener, OnInit, ViewChild} from "@angular/core";
import { TokenMetadata } from "../../data/token-metadata";
import {NotificationComponent} from "../notification/notification.component";
import { Subject, Subscription} from "rxjs";
import {TokenMetadataService} from "../../services/token-metadata.service";


@Component({
    selector: 'tokenMetadata',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './token-metadata.html'
})

export class TokenMetaDataComponent implements OnInit {
    public tokenMetadataSubscription: Subscription;
    public tokenMetadata: Map<string, TokenMetadata> = new Map<string, TokenMetadata>();
    public listAllTokens: Array<TokenMetadata> = []
    public observableMetadata = new Subject<TokenMetadata>();
    public tokenMetadata$ = this.observableMetadata.asObservable();

    cols: any[]

    @ViewChild('tokenView', {static: false}) public tokenView: any;

    constructor(public tokenMetadataService: TokenMetadataService) {
        if (globalThis.tokenMetadata == null) {
            globalThis.tokenMetadata = new Map<string, TokenMetadata>();
        }

        this.cols = [
            { field: 'name', header: 'Name'},
            { field: 'logo', header: 'Logo'},
            { field: 'ticker', header: 'Ticker'},
            { field: 'url', header: 'URL'},
            { field: 'policy', header: 'Policy'}
        ]
    }

    public ngOnInit() {
        this.tokenMetadataService.init();
        this.tokenMetadataSubscription = this.tokenMetadataService.tokenMetadata$.subscribe(tokenMetadata => {
            this.processMetadata(tokenMetadata);
        });

    }

    public processMetadata(exploreMetadata: TokenMetadata) {
        if (exploreMetadata.policy) {
            const getTokenMetadata = new TokenMetadata(exploreMetadata);
            this.listAllTokens.push(getTokenMetadata)
            globalThis.tokenMetadata.set(getTokenMetadata.policy, this.listAllTokens)
            this.listAllTokens = [...this.listAllTokens.values()]
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(event?) {
        console.log("MEMEME")
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        console.log("LALALLA")
        this.getScreenSize(event);
    }

    public getPolicyIdSubstring() {
        return this.tokenMetadataService.getPolicyIdSubstring();
    }
    
    public processError(error) {
        console.log("Error Occured")
        // this.handleError(error);
    }
}