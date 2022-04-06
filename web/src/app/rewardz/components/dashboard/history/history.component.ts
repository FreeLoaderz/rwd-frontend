import {Component, OnInit} from "@angular/core";
import {NotificationComponent} from "../../../../common/components/notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'history',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './history.html'
})

export class HistoryComponent extends NotificationComponent implements OnInit {

    constructor(public router: Router,  public titleService: Title, public notifierService: NotifierService) {
        super(notifierService);
        this.titleService.setTitle("History");
    }

    public ngOnInit() {
    }
}