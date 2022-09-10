import {Token} from "../data/token";
import {RestService} from "./rest.service";
import {Injectable} from "@angular/core";

@Injectable()
export class TokenService {
    public static tokenList: Array<Token> = [];
    public static initialized: boolean = false;
    public static finished: boolean = false;

    constructor(public restService: RestService) {
        //    if (location.host.endsWith('smartclaimz.io')) {
        if (!TokenService.initialized) {
            TokenService.initialized = true;
            console.log("get tokens");
            this.restService.getAvailableTokens()
                .then(res => this.processTokens(res))
                .catch(e => this.processError(e));
            //      }
        }
    }

    public processTokens(res: any) {
        console.log(res);
        TokenService.finished = true;
    }

    public processError(e: any) {
        console.log(e);
    }
}