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
    public observableMetadata = new Subject<TokenMetadata>();
    public tokenMetadata$ = this.observableMetadata.asObservable();

    constructor(public tokenMetadataService: TokenMetadataService) {
        if (globalThis.tokenMetadata == null) {
            globalThis.tokenMetadata = new Map<string, TokenMetadata>();
        }
    }

    ngOnInit() {
        this.listTokens()

        // Feel like the metadata should be pulled in here
        this.tokenMetadataSubscription = this.tokenMetadataService.tokenMetadata$.subscribe(tokenMetadata => {
            this.processMetadata(tokenMetadata);
        });
    }

    public processMetadata(tokenMetadata: TokenMetadata) {
        this.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
        if (globalThis.tokens.has(tokenMetadata.name)) {
            const token = globalThis.tokenMetadata.get(tokenMetadata.name);
            console.log("TOKEN INFOSSS")
            console.log(token)
        }
        // this.tokenMetadata = [...globalThis.tokenMetadata.values()];

    }

    public listTokens() {
        // this.listingTokens = true;
        globalThis.tokenMetadata.clear();
        if (location.hostname === '127.0.0.1') {
            const example: TokenMetadata = new TokenMetadata({
                "policy": "820182018282051a017290bf8200581ce97316c52c85eab276fd40feacf78bc5eff74e225e744567140070c3",
                "name": {
                    "signatures": [{
                        "publicKey": "08c2ca6654c9e43b41b0b1560ee6a7bb4997629c2646575982934a51ecd71900",
                        "signature": "5bb051ae591d1119586dbaef478098bc22f58cd2926b058f6aa445bddabd5c418b274dbe3d59b22e83c81c80c4cf6bd6f7280246b1782b38c5a9cd0bd33d6b07"
                    }], "sequenceNumber": 0, "value": "nutcoin"
                },
                "url": {
                    "signatures": [{
                        "publicKey": "08c2ca6654c9e43b41b0b1560ee6a7bb4997629c2646575982934a51ecd71900",
                        "signature": "1ff38761f6d93e58fd48e57c03cbeee848626a430f5d62b6cc555f7969b6636f07dbd0a7bf149cb577e95262c83efceb6bd0ba7724c2b146041d7853c75af603"
                    }], "sequenceNumber": 0, "value": "https://fivebinaries.com/nutcoin"
                },
                "description": {
                    "signatures": [{
                        "publicKey": "08c2ca6654c9e43b41b0b1560ee6a7bb4997629c2646575982934a51ecd71900",
                        "signature": "414a210054ac263d3a895efa1deb87faf542b9e74dc5c2165e66b2b379c20a35778e3ea3366132c3884e4f0cc6f197f0598df38a165a008671af8782c056cb0e"
                    }], "sequenceNumber": 0, "value": "The legendary Nutcoin, the first native asset minted on Cardano."
                },
                "logo": {
                    "signatures": [{
                        "publicKey": "08c2ca6654c9e43b41b0b1560ee6a7bb4997629c2646575982934a51ecd71900",
                        "signature": "a5528947e7cbd05f5fcb1ef160e903405e287ffd3efaaa8e40680f4d18fa35f72683cf56c0fbe2f7ec1d02e02f8ff9e252a49efce45659019d5c8398e59bc903"
                    }],
                    "sequenceNumber": 0,
                    "value": ""
                },
                "ticker": {
                    "signatures": [{
                        "publicKey": "08c2ca6654c9e43b41b0b1560ee6a7bb4997629c2646575982934a51ecd71900",
                        "signature": "f24fe3aaf8f67f3a99b6219a7f6688b6e84d9ee30f9b5c840e450a626cc1d605a537d503edc815a33c2fccaf12420a88ac34a85c89d0419b612e945bd581f901"
                    }], "sequenceNumber": 0, "value": "NUT"
                },
                "subject": "00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696e"
            });
            globalThis.tokenMetadata.set(example.policy, example);
            if (!this.tokenMetadata.has(example.name.value)) {
                console.log("Process Metadata")
                const metadataList = new Array<TokenMetadata>();
            }
        } else { 
            console.log("HEHE")

        }
    }

    
    public processError(error) {
        console.log("Error Occured")
        // this.handleError(error);
    }
}