import {Component, OnDestroy, OnInit} from "@angular/core";
import {NotificationComponent} from "../../../../common/components/notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {RestService} from "../../../../common/services/rest.service";
import {WalletObserverService} from "../../../../common/services/wallet-observer.service";
import {WalletService} from "../../../../common/services/wallet.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'history',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './history.html'
})

export class HistoryComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    public historyCols: any[] = [];
    public claimHistoryArray: Array<any> = [];
    public exportFileName: string;
    public datePipe = new DatePipe("en-US");

    constructor(public router: Router, public titleService: Title, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public notifierService: NotifierService) {
        super(notifierService);
        this.titleService.setTitle("History");
        this.historyCols = [
            {field: 'dateTime', header: 'Date/Time'},
            {field: 'tokenname', header: 'Token Name'},
            {field: 'amount', header: 'Amount'}
        ];
        const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.exportFileName = "Historical_SmartClaimz_".concat(dateString).concat(".csv");
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (loaded === true) {
                    this.restService.getRewardHistory()
                        .then(res => this.processHistory(res))
                        .catch(e => this.handleError(e));
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        if (this.walletLoaded === true) {
            this.restService.getRewardHistory()
                .then(res => this.processHistory(res))
                .catch(e => this.handleError(e));
        }
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }

    public processHistory(data: any) {
        console.log(data);
    }
}