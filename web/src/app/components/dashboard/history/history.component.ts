import {Component, OnInit} from "@angular/core";
import {NotificationComponent} from "../../common/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'history',
    styleUrls: ['../../../../styles/page-content.css'],
    templateUrl: './history.html'
})

export class HistoryComponent extends NotificationComponent implements OnInit {

    constructor(public router: Router, public notifierService: NotifierService) {
        super(notifierService);

    }

    public ngOnInit() {
    }
}