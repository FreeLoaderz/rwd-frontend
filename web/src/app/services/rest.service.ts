import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {lastValueFrom, Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {map} from 'rxjs/operators';
import {PropertyService} from "./property.service";

@Injectable()
export class RestService {
    public static useNewEndpoints = false;
    public static processingRequest: boolean = false;
    public static newEndpoints: boolean = false;
    public static authorization: string;

    constructor(private httpClient: HttpClient, public propertyService: PropertyService) {
        RestService.newEndpoints = ("false" !== propertyService.getProperty("newEndpoints"));
        RestService.authorization = propertyService.getProperty("authorization");
    }

    /**
     *
     * @param contactUsForm
     */
    public submitFeedback(contactUsForm: FormGroup): Observable<any> {
        const url = '/feedback/formResponse';
        let params: HttpParams = new HttpParams().set('entry.1554006855', contactUsForm.value.name);
        params = params.set('entry.2106341496', contactUsForm.value.email);
        params = params.set('entry.74038425', contactUsForm.value.subject);
        params = params.set('entry.1138654956', contactUsForm.value.message);
        params = params.set('entry.725525851', navigator.userAgent);
        params = params.set('entry.1773168385', globalThis.ipAddress);

        RestService.processingRequest = true;
        return this.httpClient
            .get(url, {responseType: 'text', params: params, observe: 'response'})
            .pipe(map(data => {
                if (data.status) {
                    return data.status;
                }
                return 404;
            }));
    }

    /**
     * Get the available rewards for a wallet
     */
    public getAvailableTokens() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        const url = '/rwdinfo/rwd/all/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Get the available token information for this contract
     * @param customerId
     * @param contractId
     */
    public getAvailableForToken(customerId: string, contractId: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        const url = '/rwdinfo/rwd/one/' + customerId + '/' + contractId + '/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Get the reward history for a wallet
     */
    public getRewardHistory() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        const url = '/rwdinfo/rwd/history/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);

    }

    /**
     * Get the reward history for a contract for this wallet
     * @param customerId
     * @param contractId
     */
    public getRewardHistoryForToken(customerId: string, contractId: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        const url = '/rwdinfo/rwd/history/' + customerId + '/' + contractId + '/' + globalThis.wallet.sending_stake_addr;
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Build a token claim transaction
     * @param multiSigType
     */
    public buildTokenClaimTx(customerId: string, multiSigType: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        let url = '/rwdbuild/ms/' + customerId + '/' + multiSigType;
        if (RestService.newEndpoints) {
            url = '/rwdbuild/ms/' + multiSigType;
        }
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Send the signature of the claim tx
     * @param customerId
     * @param multiSigType
     * @param signature
     * @param data
     */
    public signAndFinalizeTx(customerId: number, multiSigType: string, signature: any, data: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        let url = '/rwdbuild/ms/fn/' + customerId + '/' + multiSigType + '/' + data.id;
        if (RestService.newEndpoints) {
            url = '/rwdbuild/ms/fn/' + multiSigType + '/' + data.id;
        }
        RestService.processingRequest = true;

        const params = {'signature': signature};
        return lastValueFrom(this.httpClient
            .post(url, params, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Generate Testnet rewards
     * @param customerId
     * @param script
     */
    public generateRewards(customerId: string, script: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('authorization', RestService.authorization);
        const url = '/rwdbuild/ms/' + customerId + '/testrewards';
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