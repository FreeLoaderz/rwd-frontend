import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {TokenMetadata} from "../../data/token-metadata";

@Injectable()
export class MetadataObserverService {
    // Observable  source
    private metadata = new Subject<TokenMetadata>();
    // Observable  stream
    metadata$ = this.metadata.asObservable();

    public addMetadata(tokenMetadata: TokenMetadata) {
        this.metadata.next(tokenMetadata);
    }
}

