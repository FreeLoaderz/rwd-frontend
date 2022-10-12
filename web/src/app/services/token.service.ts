import {Token} from "../data/token";
import {RestService} from "./rest.service";
import {Injectable} from "@angular/core";
import {TokenMetadata} from "../data/token-metadata";
import {TokenObserverService} from "./observers/token-observer.service";

@Injectable()
export class TokenService {
    public static tokenList: Array<Token> = [];
    public static tokenMap: Map<string, Token> = new Map<string, Token>();
    public static initialized: boolean = false;
    public static finished: boolean = false;
    public static ipfsPrefix: string;
    public static outstandingTokens: number = 0;

    constructor(public restService: RestService, public tokenObserverService: TokenObserverService) {
    }

    public initialize(ipfsPrefix: string) {
        if (!TokenService.initialized) {
            TokenService.initialized = true;
            TokenService.ipfsPrefix = ipfsPrefix;
            this.restService.getAvailableTokens()
                .then(res => this.processTokens(res))
                .catch(e => this.processError(e));
        }
    }

    public processTokens(res: any) {
        TokenService.outstandingTokens = res.length;
        for (let i = 0; i < res.length; ++i) {
            const token: Token = new Token(res[i]);
            if (localStorage.getItem(token.storageId) != null) {
                token.tokenMetadata = new TokenMetadata(localStorage.getItem(token.storageId), null);
                TokenService.tokenList.push(token);
                TokenService.tokenMap.set(token.fingerprint, token);
                --TokenService.outstandingTokens;
            } else {
                this.restService.getTokenInfo(token.fingerprint)
                    .then(info => this.processTokenInfo(token, info))
                    .catch(e => this.processMetadataError(token, e));
            }
        }
    }

    /**
     *
     * @param token
     * @param tokenInfo
     */
    public processTokenInfo(token: Token, tokenInfo: any) {
        const tokenMetadata: TokenMetadata = new TokenMetadata(tokenInfo, TokenService.ipfsPrefix);
        token.tokenMetadata = tokenMetadata;
        TokenService.tokenList.push(token);
        TokenService.tokenMap.set(token.fingerprint, token);
        localStorage.setItem(token.fingerprint, JSON.stringify(tokenMetadata));
        if (--TokenService.outstandingTokens <= 0) {
            this.tokenObserverService.setTokenList(TokenService.tokenList);
            TokenService.finished = true;
        }
    }

    public processError(e: any) {
        console.log(e);
    }

    public processMetadataError(token: Token, e: any) {
        this.processError(e);
        const tokenMetadata: TokenMetadata = new TokenMetadata(null, null);
        tokenMetadata.description = "";
        tokenMetadata.shortDesc = "";
        tokenMetadata.compressedDesc = "";
        tokenMetadata.logo = "";
        token.tokenMetadata = tokenMetadata;
        TokenService.tokenList.push(token);
        TokenService.tokenMap.set(token.fingerprint, token);
        if (--TokenService.outstandingTokens <= 0) {
            this.tokenObserverService.setTokenList(TokenService.tokenList);
            TokenService.finished = true;
        }
    }
}