import {Injectable} from "@angular/core";
import {TokenMetadata} from "../data/token-metadata";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {lastValueFrom, Subject} from "rxjs";

/**
 *     public static API_ENDPOINT = ["https://tokens.cardano.org/metadata/"]
 */
@Injectable()
export class TokenMetadataService {
    public tokenMetadata: Map<string, TokenMetadata> = new Map<string, TokenMetadata>();
    public observableMetadata = new Subject<TokenMetadata>();
    public tokenMetadata$ = this.observableMetadata.asObservable();

    constructor(private httpClient: HttpClient) {
    }

    /**
     * This init() gets called by the navbar
     */
    public init() {
        if (localStorage.getItem('tokenMetadata') != null) {
            setTimeout(() => {
                const data = JSON.parse(localStorage.getItem('tokenMetadata'));
                console.log("here")
                console.log(data);
                for (let i = 0; i < data.length; ++i) {
                    const tokenMetadata = new TokenMetadata(data[i]);
                    globalThis.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
                    this.observableMetadata.next(tokenMetadata);
                    if (tokenMetadata.name !== undefined) {
                        console.log("Loaded metadata for token [" + tokenMetadata.name + "]");
                        globalThis.tokenMetadata.set(tokenMetadata.name, tokenMetadata);
                        this.observableMetadata.next(tokenMetadata);
                    }
                }
            });
        }
    }

    public getLogoMetadata(policy: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/token/metadata/' + policy;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processMetadata(res))
            .catch(this.handleError);
    }

    /**
     * Process the metadata and then store it locally (for now)
     * @param data
     */
    public processMetadata(data: any) {
        const tokenMetadata = new TokenMetadata(data);
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
    }

    handleError(error: any) {
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Unknown Server error';
        console.log(errMsg);
    }
}