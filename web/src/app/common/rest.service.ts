import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class RestService {
    public static processingRequest: boolean = false;

    constructor(private httpClient: HttpClient) {
    }

    public renameToSomeRESTCall(stringVar: string, booleanVar: boolean) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const controlUrl = '/api/renameToSomeRESTCall';  // URL to web api
        let params: HttpParams = new HttpParams().set('booleanVar', booleanVar.toString());
        params = params.set('stringVar', stringVar);
        RestService.processingRequest = true;

        return this.httpClient
            .post(controlUrl, params.toString(), {headers: headers})
            .toPromise()
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
        return error;
    }
}