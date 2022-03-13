import {Component, OnInit} from "@angular/core";
import {NotificationComponent} from "../../common/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'feedback',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './feedback.html'
})

export class FeedbackComponent extends NotificationComponent implements OnInit {

    constructor(public router: Router, public notifierService: NotifierService) {
        super(notifierService);

    }

    public ngOnInit() {
    }
}