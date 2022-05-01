import {Component, HostListener, OnDestroy, OnInit} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {RestService} from "../../services/rest.service";
import {WalletObserverService} from "../../services/wallet-observer.service";
import {WalletService} from "../../services/wallet.service";
import {DatePipe} from "@angular/common";
import {HistoricalClaim} from "../../data/historical-claim";
import {ColorService} from "../../services/color.service";
import * as d3 from "d3-scale-chromatic";
import {HistogramData} from "../../data/histogram-data";

declare let gtag: Function;

@Component({
    selector: 'history',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './history.html'
})

export class HistoryComponent extends NotificationComponent implements OnInit, OnDestroy {
    public walletSubscription: Subscription;
    public walletLoaded: boolean = false;
    public loadingHistory: boolean = false;
    public historyCols: any[] = [];
    public claimHistoryArray: Array<HistoricalClaim> = [];
    public unfilteredClaimHistoryArray: Array<HistoricalClaim> = [];
    public exportFileName: string;
    public datePipe = new DatePipe("en-US");
    public chartsHidden: boolean = true;
    public rowHeight: number = 42.25;
    public maxRows: number = 10;
    public compress: boolean = false;
    // Charts
    public donutData: any;
    public donutOptions: any;
    public colorRangeInfo = {
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: false,
    };
    public basicData: any;
    public basicOptions: any;


    constructor(public router: Router, public titleService: Title, public restService: RestService,
                public walletObserverService: WalletObserverService, public walletService: WalletService,
                public notifierService: NotifierService) {
        super(notifierService);
        this.titleService.setTitle("History");
        const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.exportFileName = "Historical_SmartClaimz_".concat(dateString);
        this.setMaxRows();
        this.setColumns();
    }

    public ngOnInit() {
        this.walletSubscription = this.walletObserverService.loaded$.subscribe(
            loaded => {
                this.walletLoaded = loaded;
                if (loaded === true) {
                    this.loadWallet();
                }
            }
        );
        this.walletLoaded = this.walletService.walletLoaded;
        if (this.walletLoaded === true) {
            this.loadWallet();
        }
    }

    public loadWallet() {
        this.loadingHistory = true;
        this.restService.getRewardHistory()
            .then(res => this.processHistory(res))
            .catch(e => this.handleError(e));
    }

    public generateCharts() {
        const donutMap: Map<string, number> = new Map<string, number>();
        const basicMap: Map<number, Map<number, Array<HistoricalClaim>>> = new Map<number, Map<number, Array<HistoricalClaim>>>();
        this.unfilteredClaimHistoryArray.forEach(claim => {
            if (donutMap.has(claim.displayName)) {
                const curAmount: number = +donutMap.get(claim.displayName);
                const newAmount: number = curAmount + +claim.amount;
                donutMap.set(claim.displayName, +newAmount);
            } else {
                donutMap.set(claim.displayName, +claim.amount);
            }

            if (basicMap.has(claim.year)) {
                const yearMap = basicMap.get(claim.year);
                if (yearMap.has(claim.month)) {
                    const monthArray = yearMap.get(claim.month);
                    monthArray.push(claim);
                } else {
                    const monthArray: Array<HistoricalClaim> = new Array<HistoricalClaim>();
                    monthArray.push(claim);
                    yearMap.set(claim.month, monthArray);
                }
            } else {
                const yearMap: Map<number, Array<HistoricalClaim>> = new Map<number, Array<HistoricalClaim>>();
                const monthArray: Array<HistoricalClaim> = new Array<HistoricalClaim>();
                monthArray.push(claim);
                yearMap.set(claim.month, monthArray);
                basicMap.set(claim.year, yearMap);
            }
        });
        const tokenMap: Map<string, HistogramData> = new Map<string, HistogramData>();
        const yearKeys: Array<number> = [...basicMap.keys()];
        const sortedYears: number[] = yearKeys.sort((n1, n2) => n1 - n2);
        const minYear = sortedYears[0];
        const maxYear = sortedYears[sortedYears.length - 1];
        let minMonth = 12;
        let maxMonth = 1;
        for (let i = 0; i < sortedYears.length; ++i) {
            const monthMap: Map<number, Array<HistoricalClaim>> = basicMap.get(sortedYears[i]);
            const monthKeys: Array<number> = [...monthMap.keys()];
            const sortedMonths: number[] = monthKeys.sort((n1, n2) => n1 - n2);
            if (i === 0) {
                minMonth = sortedMonths[0];
            }
            if (i === (sortedYears.length - 1)) {
                maxMonth = sortedMonths[sortedMonths.length - 1];
            }
            for (let j = 0; j < sortedMonths.length; ++j) {
                const monthTotalByToken: Map<string, number> = new Map<string, number>();
                const claimArray: Array<HistoricalClaim> = monthMap.get(sortedMonths[i]);
                claimArray.forEach(claim => {
                    if (monthTotalByToken.has(claim.displayName)) {
                        const curAmount: number = +monthTotalByToken.get(claim.displayName);
                        const newAmount: number = curAmount + +claim.amount;
                        monthTotalByToken.set(claim.displayName, +newAmount);
                    } else {
                        monthTotalByToken.set(claim.displayName, +claim.amount);
                    }
                });
                monthTotalByToken.forEach((value, key) => {
                    if (tokenMap.has(key)) {
                        const histData: HistogramData = tokenMap.get(key);
                        if (histData.yearMonthTotalMap.has(sortedYears[i])) {
                            const monthMap1: Map<number, number> = histData.yearMonthTotalMap.get(sortedYears[i]);
                            monthMap1.set(sortedMonths[j], value);
                        } else {
                            const monthMap2: Map<number, number> = new Map<number, number>();
                            monthMap2.set(sortedMonths[j], value);
                            histData.yearMonthTotalMap.set(sortedYears[i], monthMap2);
                        }
                    } else {
                        const histData: HistogramData = new HistogramData();
                        histData.label = key;
                        const monthMap3: Map<number, number> = new Map<number, number>();
                        monthMap3.set(sortedMonths[j], value);
                        histData.yearMonthTotalMap.set(sortedYears[i], monthMap3);
                        tokenMap.set(key, histData);
                    }
                });
            }
        }

        const chartColors = ColorService.interpolateColors(tokenMap.size, d3.interpolateInferno, this.colorRangeInfo);
        const tokenNames = [...tokenMap.keys()];
        for (let i = 0; i < tokenNames.length; ++i) {
            const histData = tokenMap.get(tokenNames[i]);
            histData.setArray(minYear, minMonth, maxYear, maxMonth);
            histData.backgroundColor = chartColors[i];
        }

        const basicLabels: Array<string> = HistogramData.getLabels(minYear, minMonth, maxYear, maxMonth);

        this.basicData = {
            labels: [...basicLabels],
            datasets: [...tokenMap.values()]
        };

        const labelArray: Array<string> = [];
        const dataArray: Array<number> = [];

        donutMap.forEach((value, key) => {
            const label = key + " " + value;
            labelArray.push(label);
            dataArray.push(value);
        });
        this.donutData = {
            labels: [...labelArray],
            datasets: [
                {
                    data: [...dataArray],
                    backgroundColor: [...chartColors],
                    hoverBackgroundColor: [...chartColors]
                }
            ]
        };
    }

    @HostListener('window:resize', ['$event'])
    public windowResize(event?) {
        this.setColumns();
        this.setMaxRows();
    }

    public setColumns() {
        if (window.innerWidth <= 600) {
            this.historyCols = [
                {field: 'shortDate', header: 'Time'},
                {field: 'stake_addr', header: 'Stake Address', hidden: true},
                {field: 'payment_addr', header: 'Payment Address', hidden: true},
                {field: 'displayName', header: 'Token'},
                {field: 'amount', header: 'Amt'},
                {field: 'txSuperShortURL', header: 'Hash', exportable: false},
                {field: 'txhash', header: 'Raw Tx Hash', hidden: true}];
        } else if (window.innerWidth <= 1200) {
            this.historyCols = [
                {field: 'displayTS', header: 'Date/Time'},
                {field: 'stake_addr', header: 'Stake Address', hidden: true},
                {field: 'payment_addr', header: 'Payment Address', hidden: true},
                {field: 'displayName', header: 'Token'},
                {field: 'amount', header: 'Amount'},
                {field: 'txShortURL', header: 'Tx Hash', exportable: false},
                {field: 'txhash', header: 'Raw Tx Hash', hidden: true}];
        } else {
            this.historyCols = [
                {field: 'displayTS', header: 'Date/Time'},
                {field: 'stake_addr', header: 'Stake Address', hidden: true},
                {field: 'payment_addr', header: 'Payment Address', hidden: true},
                {field: 'displayName', header: 'Token'},
                {field: 'amount', header: 'Amount'},
                {field: 'txURL', header: 'Tx Hash', exportable: false},
                {field: 'txhash', header: 'Raw Tx Hash', hidden: true}];
        }
        this.historyCols = [...this.historyCols];
        if (window.innerWidth < 700) {
            this.compress = true;
        } else {
            this.compress = false;
        }
    }

    public setMaxRows() {
        globalThis.screenHeight = window.innerHeight;
        const tempMaxRows = +((globalThis.screenHeight - 400) / this.rowHeight).toFixed(0);
        if (tempMaxRows < 10) {
            this.maxRows = 10;
        } else {
            this.maxRows = tempMaxRows;
        }
        this.generateCharts();
    }

    @HostListener('window:orientationchange', ['$event'])
    public onOrientationChange(event) {
        this.windowResize(event);
    }

    public ngOnDestroy() {
        this.walletSubscription.unsubscribe();
    }

    public processError(e: any) {
        this.loadingHistory = false;
        this.handleError(e);
    }

    public processHistory(data: any) {
        if (data != null) {
            const tempClaimHistoryArray: Array<HistoricalClaim> = [];
            for (let i = 0; i < data.length; ++i) {
                const historicalClaim = new HistoricalClaim(data[i]);
                tempClaimHistoryArray.push(historicalClaim);
            }
            tempClaimHistoryArray.sort((a, b) => HistoricalClaim.sort(a, b));
            this.claimHistoryArray = [...tempClaimHistoryArray];
            this.unfilteredClaimHistoryArray = [...tempClaimHistoryArray];
            this.generateCharts();
        }
        this.loadingHistory = false;
    }

    public hideCharts(hide: boolean) {
        this.chartsHidden = hide;
        if (location.host === 'rwd.freeloaderz.io') {
            if (this.chartsHidden) {
                gtag('set', 'page_path', "History");
                gtag('event', 'page_view');
            } else {
                gtag('set', 'page_path', "History-Charts");
                gtag('event', 'page_view');
            }
        }
    }

    onFilter(event, dt) {
        this.unfilteredClaimHistoryArray = [...event.filteredValue];
        this.generateCharts();
    }
}