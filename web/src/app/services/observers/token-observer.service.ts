import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Token} from "../../data/token";

@Injectable()
export class TokenObserverService {
    public tokenList: Array<Token> = [];
    public tokenListSubject = new Subject<Array<Token>>();
    tokenList$ = this.tokenListSubject.asObservable();

    setTokenList(tokenList: Array<Token>) {
        this.tokenList = tokenList;
        this.tokenListSubject.next(tokenList);
    }
}

