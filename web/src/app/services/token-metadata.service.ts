import {Injectable} from "@angular/core";
import {TokenMetadata} from "../data/token-metadata";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {lastValueFrom, Subject} from "rxjs";
import {RestService} from "./rest.service";
import {MetadataObserverService} from "./observables/metadata-observer.service";

/**
 *     public static API_ENDPOINT = ["https://tokens.cardano.org/metadata/"]
 *
 *     The only thing this service should do is query for token metadata to make it available to
 *     other components.
 */
@Injectable()
export class TokenMetadataService {
    public tokenMetadata: Map<string, TokenMetadata> = new Map<string, TokenMetadata>();

    constructor(private restService: RestService, public metadataObserver: MetadataObserverService) {
    }

    /**
     * This init() gets called by the navbar
     */
    public init() {
      /*  if (localStorage.getItem('tokenMetadata') != null) {
            setTimeout(() => {
                 const data = JSON.parse(localStorage.getItem('tokenMetadata'));
                for (let i = 0; i < data.length; ++i) {
                    const tokenMetadata = new TokenMetadata(data[i]);
                    this.observableMetadata.next(tokenMetadata);
                 if (tokenMetadata.name !== undefined) {
                     console.log("Loaded metadata for token [" + tokenMetadata.name + "]");
                     globalThis.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
                     this.observableMetadata.next(tokenMetadata);
                 }
                }
            });
        }*/
    }

public getTokenMetadata(tokenName: string) {
if (this.tokenMetadata.has(tokenName)) {
    this.metadataObserver.addMetadata(this.tokenMetadata.get(tokenName));
}else {
    this.restService.getTokenMetadata(tokenName)
        .then(res => this.processMetadata(res))
        .catch(e => this.handleError(e));
}
}

    /**
     * Process the metadata and then store it locally (for now)
     * @param data
     */
    public processMetadata(data: any) {
        console.log(data);
/**        const tokenMetadata = new TokenMetadata(data);
        this.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
        localStorage.setItem('tokenMetadata', JSON.stringify(this.tokenMetadata.values()));
        this.observableMetadata.next(tokenMetadata);
        const metadataList = new Array<TokenMetadata>();
        this.tokenMetadata.forEach(metadata => {
            if ((metadata != null) && (metadata.name != null)) {
                metadataList.push(metadata);
            }
        });
        console.log("localstore tokenmetadata -> [" + metadataList.length + "]");
        localStorage.setItem('tokenMetadata', JSON.stringify(metadataList));
   **/
    }

    handleError(error: any) {
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Unknown Server error';
        console.log(errMsg);
    }
}