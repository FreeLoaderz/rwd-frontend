import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
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

    public processMetadata(exploreMetadata: TokenMetadata) {
        globalThis.tokenMetadata.set(exploreMetadata.policy, exploreMetadata);
        if (globalThis.tokenMetadata.has(exploreMetadata.policy)) {
            const getTokenMetadata = new TokenMetadata(exploreMetadata);
            this.listAllTokens.push(getTokenMetadata)
            globalThis.tokenMetadata.set(this.listAllTokens, getTokenMetadata)
            this.listAllTokens = [...this.listAllTokens.values()]

        }
    }
    
    public processError(error) {
        console.log("Error Occured")
        // this.handleError(error);
    }
}