import {Component} from '@angular/core';
import {NotificationComponent} from "../../../common/components/notification/notification.component";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    selector: 'dashboard',
    styleUrls: ['../../styles/page-content.css'],
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends NotificationComponent {
    public walletSubscription: Subscription;

    constructor(public router: Router, public notifierService: NotifierService) {
        super(notifierService);
    }

    public showCollectRewards() {
        this.router.navigate(['/dashboard/rewards']);
    }

    public showHistory() {
        this.router.navigate(['/dashboard/history']);

    }

    public showFeedback() {
        this.router.navigate(['/dashboard/feedback']);

    }
}