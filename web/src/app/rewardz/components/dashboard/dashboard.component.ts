import {AfterViewInit, Component, Inject} from '@angular/core';
import {NotificationComponent} from "../../../common/components/notification/notification.component";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'dashboard',
    styleUrls: ['../../styles/page-content.css'],
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends NotificationComponent implements AfterViewInit {
    public walletSubscription: Subscription;

    constructor(@Inject(DOCUMENT) private document: Document,
                public router: Router, public notifierService: NotifierService) {
        super(notifierService);
    }

    public ngAfterViewInit() {
        this.setActive("rewards");
    }

    public showCollectRewards() {
        this.setActive("rewards");
        this.router.navigate(['/dashboard/rewards']);
    }

    public showHistory() {
        this.setActive("history");
        this.router.navigate(['/dashboard/history']);

    }

    public showFeedback() {
        this.setActive("feedback");
        this.router.navigate(['/dashboard/feedback']);
    }

    public setActive(sourceId: string) {
        this.document.getElementById("rewards").classList.remove("active");
        this.document.getElementById("history").classList.remove("active");
        this.document.getElementById("feedback").classList.remove("active");
        this.document.getElementById(sourceId).classList.add("active");
    }
}