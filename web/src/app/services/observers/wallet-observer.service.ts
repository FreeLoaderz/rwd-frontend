import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class WalletObserverService {
    // Observable boolean source
    private loaded = new Subject<boolean>();
    // Observable boolean stream
    loaded$ = this.loaded.asObservable();

    // Service message command
    setloaded(loaded: boolean) {
        this.loaded.next(loaded);
    }

    private showConnect = new Subject<boolean>();
    // Observable boolean stream
    showConnect$ = this.showConnect.asObservable();

    // Service message command
    setShowConnect(showConnect: boolean) {
        this.showConnect.next(showConnect);
    }

    private error = new Subject<string>();
    // Observable boolean stream
    error$ = this.error.asObservable();

    // Service message command
    setError(error: string) {
        this.error.next(error);
    }
}

