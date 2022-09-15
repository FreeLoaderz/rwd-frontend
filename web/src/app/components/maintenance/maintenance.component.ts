import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NotificationComponent} from "../notification/notification.component";
import {NotifierService} from "angular-notifier";
import {PropertyService} from "../../services/property.service";
import {PropertyObserverService} from "../../services/observers/property-observer.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'maintenance',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './maintenance.html'
})

export class MaintenanceComponent extends NotificationComponent implements OnInit, OnDestroy {
    public maintenance: string = null;
    public keepAlive: boolean = true;
    public propertySubscription: Subscription;
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public notifierService: NotifierService, public propertyObserver: PropertyObserverService) {
        super(notifierService);
    }

    public ngOnInit() {
        this.propertySubscription = this.propertyObserver.propertyMap$.subscribe(propertyMap => {
            this.maintenance = propertyMap.get("maintenance");
            this.processMaintenance();
        });
        if (this.propertyObserver.propertyMap.has("maintenance")) {
            this.maintenance = this.propertyObserver.propertyMap.get("maintenance");
            this.processMaintenance();
        }
    }

    public ngOnDestroy() {
        this.propertySubscription.unsubscribe();
    }

    public processMaintenance() {
        if ((this.maintenance != null) && (this.maintenance.trim() !== '')) {
            this.maintenance = this.maintenance.concat("<a><i class='ms-2 fa-solid fa-xmark'></i></a>");
            setTimeout(async () => {
                while (this.keepAlive) {
                    this.customNotification("warning", this.maintenance, this.notificationTemplate);
                    await new Promise(f => setTimeout(f, 30000));
                }
            });
        }
    }

    public stop() {
        this.keepAlive = false;
    }
}