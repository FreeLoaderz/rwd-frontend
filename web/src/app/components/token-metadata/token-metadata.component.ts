import {Component, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {TokenMetadata} from "../../data/token-metadata";
import {Subject, Subscription} from "rxjs";
import {TokenMetadataService} from "../../services/token-metadata.service";


@Component({
    selector: 'explore',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './token-metadata.html'
})

export class TokenMetaDataComponent implements OnInit, OnDestroy {
    public tokenMetadataSubscription: Subscription;
    public tokenMetadata: Map<string, TokenMetadata> = new Map<string, TokenMetadata>();
    public listAllTokens: Array<TokenMetadata> = [];

    public policyArray: Array<string> = [];

    @ViewChild('tokenView', {static: false}) public tokenView: any;

    constructor(public tokenMetadataService: TokenMetadataService) {
        if (globalThis.tokenMetadata == null) {
            globalThis.tokenMetadata = new Map<string, TokenMetadata>();
        }
    }

    public ngOnInit() {
        this.tokenMetadataService.init();
        this.tokenMetadataSubscription = this.tokenMetadataService.tokenMetadata$.subscribe(tokenMetadata => {
            this.processMetadata(tokenMetadata);
        });

    }

    /**
     * If you create subscriptions, you need to unsubscribe when the page is destroyed.  Otherwise, it actually stays active.
     */
    public ngOnDestroy() {
        this.tokenMetadataSubscription.unsubscribe();
    }

    public processMetadata(exploreMetadata: TokenMetadata) {
        if (exploreMetadata.policy) {
            this.listAllTokens.push(exploreMetadata);
            this.listAllTokens = [...this.listAllTokens];
            
            globalThis.tokenMetadata.set(exploreMetadata.policy, exploreMetadata);
        }
    }

    public setPolicy() {
        if (window.innerWidth <= 700) {
            for (const item of globalThis.tokenMetadata.values()) {
                item.policy = item.shortPolicy;
            }
        }
    }

    @HostListener('window:resize', ['$event'])
    public windowResize(event?) {
        globalThis.screenHeight = window.innerHeight;
        globalThis.screenWidth = window.innerWidth;
        this.setPolicy();
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        console.log("LALALLA");
        this.windowResize(event);
    }

    public processError(error) {
        console.log("Error Occured");
        // this.handleError(error);
    }
}