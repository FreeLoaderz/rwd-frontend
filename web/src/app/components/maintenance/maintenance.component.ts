import {Component, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";
import {PropertyService} from "../../services/property.service";

@Component({
    selector: 'maintenance',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './maintenance.html'
})

export class MaintenanceComponent extends NotificationComponent implements OnInit {
    public maintenance: string = null;
    public keepAlive: boolean = true;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public notifierService: NotifierService, public propertiesService: PropertyService) {
        super(notifierService);
    }

    public ngOnInit() {
        this.maintenance = this.propertiesService.getProperty("maintenance");
        if (this.maintenance != null) {
            console.log(this.maintenance);
            this.maintenance = this.maintenance.concat("<a><i class='ms-2 fa-solid fa-xmark'></i></a>");
            setTimeout(async () => {
                while (this.keepAlive) {
                    this.customNotification("warning", this.maintenance, this.notificationTemplate);
                    await new Promise(f => setTimeout(f, 30000));
                }
                console.log("stopped");
            });
        }
    }

    public stop() {
        console.log("stop");
        this.keepAlive = false;
    }
}