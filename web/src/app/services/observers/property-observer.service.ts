import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class PropertyObserverService {
    // Observable Map<string, string> source
    public propertyMap: Map<string, string> = new Map<string, string>();
    public propertyMapSubject = new Subject<Map<string, string>>();
    // Observable Map<string, string> stream
    propertyMap$ = this.propertyMapSubject.asObservable();

    setPropertyMap(propertyMap: Map<string, string>) {
        this.propertyMap = new Map<string, string>(propertyMap);
        this.propertyMapSubject.next(propertyMap);
    }
}

