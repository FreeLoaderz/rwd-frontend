import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {lastValueFrom} from "rxjs";

@Injectable()
export class RestService {
    public static processingRequest: boolean = false;

    constructor(private httpClient: HttpClient) {
    }

    public getAvailableTokens() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdinfo/rewards/all/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, '', {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public buildTokenClaimTx(customerId: string, multiSigType: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdbuild/multisig/' + customerId+ '/' + multiSigType;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public getRewardHistory() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdinfo/rewards/history/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, '', {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);

    }

    public fakeListTokens(url: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public fakeClaimTokens(url: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        RestService.processingRequest = true;
        console.log(globalThis.wallet);
        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public signAndFinalizeTx(signature: any, data: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwd/multisig/finalize/6/sporwc/' + data.id;
        RestService.processingRequest = true;

        const params = {'signature': signature};
        console.log("signature");
        return lastValueFrom(this.httpClient
            .post(url, params, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public isProcessingRequest() {
        return RestService.processingRequest;
    }

    private processResponse(response: any) {
        RestService.processingRequest = false;
        return response;
    }

    private handleError(error: any) {
        // bubble the error up to be handled by the component
        RestService.processingRequest = false;
        throw error;
    }
}