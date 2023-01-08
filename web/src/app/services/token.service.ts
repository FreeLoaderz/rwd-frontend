import {Token} from "../data/token";
import {RestService} from "./rest.service";
import {Injectable} from "@angular/core";
import {TokenMetadata} from "../data/token-metadata";
import {TokenObserverService} from "./observers/token-observer.service";

@Injectable()
export class TokenService {
    public static tokenList: Array<Token> = [];
    public static tokenMap: Map<string, Token> = new Map<string, Token>();
    public static seenMap: Map<string, any> = new Map<string, any>();
    public static duplicateList: Array<Token> = [];
    public static initialized: boolean = false;
    public static ipfsPrefix: string;

    constructor(public restService: RestService, public tokenObserverService: TokenObserverService) {
    }

    public initialize(ipfsPrefix: string) {
        if (!TokenService.initialized) {
            TokenService.initialized = true;
            TokenService.ipfsPrefix = ipfsPrefix;
            this.restService.getAvailableTokens()
                .then(res => this.processTokens(res))
                .catch(e => console.log(e));
        }
    }

    public processTokens(res: any) {
        for (let i = 0; i < res.length; ++i) {
            const token: Token = new Token(res[i]);
            if (!TokenService.seenMap.has(token.fingerprint)) {
                TokenService.seenMap.set(token.fingerprint, true);
                if (localStorage.getItem(token.storageId) != null) {
                    token.tokenMetadata = new TokenMetadata(localStorage.getItem(token.storageId), null);
                    this.checkLogo(token);
                } else {
                    setTimeout(() => {
                        this.restService.getTokenInfo(token.fingerprint)
                            .then(info => this.processTokenInfo(token, info))
                            .catch(e => this.processMetadataError(token, e));
                    });
                }
            } else {
                TokenService.duplicateList.push(token);
            }
        }
        this.updateFromDupes();
    }

    updateFromDupes() {
        const seenList = [...TokenService.seenMap.values()];
        const tokenList = [...TokenService.tokenMap.values()];
        if (seenList.length === tokenList.length) {
            for (let i = 0; i < TokenService.duplicateList.length; ++i) {
                if (TokenService.tokenMap.has(TokenService.duplicateList[i].fingerprint)) {
                    const token = TokenService.tokenMap.get(TokenService.duplicateList[i].fingerprint);
                    token.addPools(TokenService.duplicateList[i]);
                }
            }
        } else {
            setTimeout(() => {
                this.updateFromDupes();
            }, 500);
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
        this.checkLogo(token);
    }

    /**
     *
     * @param token
     * @param tokenInfo
     */
    public processBackupTokenInfo(token: Token, tokenInfo: any) {
        const tokenMetadata: TokenMetadata = new TokenMetadata(null, null);
        tokenMetadata.fromBackup(token.fingerprint, TokenService.ipfsPrefix, tokenInfo);
        token.tokenMetadata = tokenMetadata;
        this.pushToken(token);
    }

    public checkLogo(token: Token) {
        return fetch(token.tokenMetadata.logo)
            .then(res => {
                if (token.tokenMetadata.description == null) {
                    this.fillInTokenBlanks(token);
                } else {
                    this.pushToken(token);
                }
            })
            .catch(err => {
                this.fillInTokenBlanks(token);
            });
    }

    public pushToken(token: Token) {
        TokenService.tokenList.push(token);
        TokenService.tokenMap.set(token.fingerprint, token);
        localStorage.setItem(token.fingerprint, JSON.stringify(token.tokenMetadata));
        this.tokenObserverService.setTokenList(TokenService.tokenList);
    }

    public fillInTokenBlanks(token: Token) {
        let tokenName = token.displayName;
        if (tokenName === 'gimbal') {
            tokenName = "GMBL";
        }
        this.restService.getBackupTokenMetadata(tokenName)
            .then(info => {
                token.tokenMetadata.fromBackup(token.fingerprint, TokenService.ipfsPrefix, info);
                this.pushToken(token);
            })
            .catch(e2 => {
                this.pushToken(token);
            });
    }

    public processMetadataError(token: Token, e: any) {
        this.restService.getBackupTokenMetadata(token.displayName)
            .then(info => this.processBackupTokenInfo(token, info))
            .catch(e2 => {
                const tokenMetadata: TokenMetadata = new TokenMetadata(null, null);
                tokenMetadata.description = "";
                tokenMetadata.shortDesc = "";
                tokenMetadata.compressedDesc = "";
                tokenMetadata.logo = "";
                token.tokenMetadata = tokenMetadata;
                this.pushToken(token);
            });
    }
}
