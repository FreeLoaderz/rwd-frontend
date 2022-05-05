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

    columns: any[];

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
            const getTokenMetadata = new TokenMetadata(exploreMetadata);
            this.listAllTokens.push(getTokenMetadata);
            /**
             * This below is "key -> value" pair, but your tokens all have different policies
             *
             * With how this is written, you end up putting the previous token(s) into the value for the "next" policy
             *
             * If you want to group by policy, you need a separate list.
             * Check if globalThis.tokenMetadata has the key.
             * If it doesn't, create a new list and add the value.
             * If it does, get the list using the key, and then add the value.
             */
            globalThis.tokenMetadata.set(getTokenMetadata.policy, this.listAllTokens);
            this.listAllTokens = [...this.listAllTokens.values()];
        }
    }

    public setPolicy() {
        if (window.innerWidth <= 700) {
            this.columns = [
                {field: 'shortPolicy', header: null}
            ];
        } else {
            this.columns = [
                {field: 'policy', header: null}
            ];
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