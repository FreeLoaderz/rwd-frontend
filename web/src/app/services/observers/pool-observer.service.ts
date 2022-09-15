import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Pool} from "../../data/pool";

@Injectable()
export class PoolObserverService {
    public poolList: Array<Pool> = [];
    public poolListSubject = new Subject<Array<Pool>>();
    poolList$ = this.poolListSubject.asObservable();

    setPoolList(poolList: Array<Pool>) {
        this.poolList = poolList;
        this.poolListSubject.next(poolList);
    }
}

