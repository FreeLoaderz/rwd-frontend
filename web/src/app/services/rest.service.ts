import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {lastValueFrom, Observable, Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";
import {map} from 'rxjs/operators';
import {PropertyObserverService} from "./observers/property-observer.service";

@Injectable()
export class RestService {
    public static processingRequest: boolean = false;
    public static heimdallrAuthorization: string;
    public static vidarAuthorization: string;
    public static propertySubscription: Subscription;

    constructor(private httpClient: HttpClient, public propertyObserver: PropertyObserverService) {
        if (RestService.propertySubscription == null) {
            RestService.propertySubscription = propertyObserver.propertyMap$.subscribe(propertyMap => {
                RestService.vidarAuthorization = propertyMap.get("vidar-authorization");
                RestService.heimdallrAuthorization = propertyMap.get("heimdallr-authorization");
            });
        }
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
     *
     * @param registerForm
     */
    public submitRegistration(registerForm: FormGroup): Observable<any> {
        const url = '/projectRegistration/formResponse';
        let params: HttpParams = new HttpParams().set('usp', 'pp_url');
        params = params.set('entry.1445209345', registerForm.value.email);
        params = params.set('entry.2111957306', registerForm.value.name);
        params = params.set('entry.1019957974', registerForm.value.project);
        params = params.set('entry.517542324', registerForm.value.projectUrl);
        params = params.set('entry.183292568', registerForm.value.projectDescription);
        params = params.set('entry.1844949805', registerForm.value.twitter);
        params = params.set('entry.1196449185', registerForm.value.discord);
        params = params.set('entry.1937437362', registerForm.value.linkedIn);
        params = params.set('entry.745059288', registerForm.value.instagram);
        params = params.set('entry.478426149', registerForm.value.facebook);
        params = params.set('entry.1354993104', registerForm.value.tokenName);
        params = params.set('entry.590651180', registerForm.value.policyId);
        params = params.set('entry.2010747889', registerForm.value.tokenDescription);
        params = params.set('entry.423117119', registerForm.value.tokenUrl);
        params = params.set('entry.831647180', registerForm.value.decimals);
        params = params.set('entry.1712015530', registerForm.value.distroMethod);
        params = params.set('entry.327914681', registerForm.value.bech32Url);

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
     *
     */
    public getAvailableProjects() {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdinfo/rwd/all/projects';
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     *
     */
    public getAvailableTokens() {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdinfo/tokens';
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public getAvailablePools() {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdinfo/tokens/pools';
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Get the available rewards for a wallet
     */
    public getMyAvailableTokens() {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
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
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
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
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
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
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
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
        let headers;
        if (RestService.heimdallrAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.heimdallrAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdbuild/ms/' + multiSigType;
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
        let headers;
        if (RestService.heimdallrAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.heimdallrAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdbuild/ms/fn/' + multiSigType + '/' + data.id;
        RestService.processingRequest = true;

        const params = {'signature': signature};
        return lastValueFrom(this.httpClient
            .post(url, params, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public buildDelegationTx() {
        let headers;
        if (RestService.heimdallrAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.heimdallrAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdbuild/tx/stakedelegation';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }


    public signDelegationTx(signature: any, data: any) {
        let headers;
        if (RestService.heimdallrAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.heimdallrAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdbuild/tx/fn/stakedelegation/' + data.id;
        RestService.processingRequest = true;

        const params = {'signature': signature};
        return lastValueFrom(this.httpClient
            .post(url, params, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    /**
     * Generate Preview rewards
     * @param customerId
     * @param script
     */
    public generateRewards(customerId: string, script: any) {
        let headers;
        if (RestService.heimdallrAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.heimdallrAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdbuild/ms/testrewards';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, script, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public async getTokenInfo(fingerprint: string) {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdinfo/token/info/' + fingerprint;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public async getPoolInfo(poolId: string) {
        let headers;
        if (RestService.vidarAuthorization != null) {
            headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', RestService.vidarAuthorization);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json');
        }
        const url = '/rwdinfo/tokens/pools/info/' + poolId;
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public getPoolMetadata(poolId: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('project_id', "");
        const url = '/bf/api/v0/pools/' + poolId + '/metadata';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public verifyWallet() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/api/verifyWallet';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public verifyAddress(address: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/api/verifyAddress';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, address, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public mint() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/api/mint';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, globalThis.wallet, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public signMint(tx: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/api/signMint';
        RestService.processingRequest = true;

        return lastValueFrom(this.httpClient
            .post(url, tx, {headers: headers}))
            .then(res => this.processResponse(res))
            .catch(this.handleError);
    }

    public getBackupTokenMetadata(tokenName: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const url = '/metadata/api/v0/ticker/' + tokenName + '/all';
        RestService.processingRequest = true;
        return lastValueFrom(this.httpClient
            .get(url, {headers: headers}))
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
