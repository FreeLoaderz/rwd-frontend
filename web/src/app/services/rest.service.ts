import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {lastValueFrom, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {map} from 'rxjs/operators';

@Injectable()
export class RestService {
    public static processingRequest: boolean = false;

    constructor(private httpClient: HttpClient) {
    }

    public submitFeedback(contactUsForm: FormGroup): Observable<any> {
        const url = '/feedback/formResponse';
        let params: HttpParams = new HttpParams().set('entry.1554006855', contactUsForm.value.name);
        params = params.set('entry.2106341496', contactUsForm.value.email);
        params = params.set('entry.74038425', contactUsForm.value.subject);
        params = params.set('entry.1138654956', contactUsForm.value.message);
        params = params.set('entry.725525851', navigator.userAgent);
        params = params.set('entry.1773168385', globalThis.ipAddress);

        RestService.processingRequest = true;
        console.log(url);
        return this.httpClient
            .get(url, {responseType: 'text', params: params, observe: 'response'})
            .pipe(map(data => {
                if (data.status) {
                    return data.status;
                }
                return 404;
            }));
    }

    public getAvailableTokens() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdinfo/rewards/all/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;
        console.log(url);
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public buildTokenClaimTx(customerId: string, multiSigType: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdbuild/multisig/' + customerId + '/' + multiSigType;
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
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);

    }

    public signAndFinalizeTx(customerId: number, multiSigType: string, signature: any, data: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdbuild/multisig/finalize/' + customerId + '/' + multiSigType + '/' + data.id;
        RestService.processingRequest = true;

        const params = {'signature': signature};
        return lastValueFrom(this.httpClient
            .post(url, params, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public generateRewards(customerId: string, script: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', 'Eevoo0aemah1ohY6Oheehee4ivahR5ae');
        const url = '/rwdbuild/multisig/' + customerId + '/testrewards';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, script, {headers: headers}))
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