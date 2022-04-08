import {Component, OnDestroy, OnInit} from "@angular/core";
import {NotificationComponent} from "../../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {RestService} from "../../../services/rest.service";
import {WalletObserverService} from "../../../services/wallet-observer.service";
import {WalletService} from "../../../services/wallet.service";
import {DatePipe} from "@angular/common";
import {HistoricalClaim} from "../../../data/historical-claim";

@Component({
    selector: 'history',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './history.html'
})

export class HistoryComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    public historyCols: any[] = [];
    public claimHistoryArray: Array<HistoricalClaim> = [];
    public exportFileName: string;
    public datePipe = new DatePipe("en-US");

    constructor(public router: Router, public titleService: Title, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public notifierService: NotifierService) {
        super(notifierService);
        this.titleService.setTitle("History");
        this.historyCols = [
            {field: 'displayTS', header: 'Date/Time'},
            {field: 'stake_addr', header: 'Stake Address', hidden: true},
            {field: 'payment_addr', header: 'Payment Address', hidden: true},
            {field: 'displayName', header: 'Token Name'},
            {field: 'amount', header: 'Amount'},
            {field: 'txURL', header: 'Tx Hash'},
            {field: 'txhash', header: 'Raw Tx Hash', hidden: true}];
        const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.exportFileName = "Historical_SmartClaimz_".concat(dateString);
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
            for (let i = 0; i < 77; ++i) {
                const example = new HistoricalClaim({
                    "stake_addr": "stake_test1urr8a6dy0zr2wte054xu7x9t63mnksh3gmr2vwfsj24upfcc9krzk",
                    "payment_addr": "addr_test1qra78hxqu8pvyugm3uyw56xg05ryxcwp3ezqjtf73dmtrk7x0m56g7yx5uhjlf2deuv2h4rh8dp0z3kx5cunpy4tcznscs90gk",
                    "policyid": "542b7ade184b6eea769f42d2d1f2902f366e0e9369b719d671e3d498",
                    "tokenname": "61706578636f696e",
                    "fingerprint": "asset1wpsl4pru06cnuf8xy8n2s0l0tpwfu6t0t8yxzj",
                    "amount": "1",
                    "contract_id": 1,
                    "user_id": 1,
                    "txhash": "2eee3be7ceec6402d37eb9758f028ab770de0ab82d8efe1a5895f75088579951",
                    "invalid": null,
                    "invalid_descr": null,
                    "timestamp": "2022-04-08T19:04:22.646296Z",
                    "updated_at": "2022-04-08T19:04:22.646296Z"
                });
                this.claimHistoryArray.push(example);
            }
            this.claimHistoryArray = [...this.claimHistoryArray];
            //    this.restService.getRewardHistory()
            //       .then(res => this.processHistory(res))
            //      .catch(e => this.handleError(e));
        }
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }

    public processHistory(data: any) {
        if (data != null) {
            const tempClaimHistoryArray: Array<HistoricalClaim> = [];
            for (let i = 0; i < data.length; ++i) {
                const historicalClaim = new HistoricalClaim(data[i]);
                tempClaimHistoryArray.push(historicalClaim);
            }
            this.claimHistoryArray = [...tempClaimHistoryArray];
        }
    }
}