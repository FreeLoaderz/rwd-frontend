import {NotificationComponent} from "./components/notification.component";
import {NotifierService} from "angular-notifier";

export abstract class WebsocketSubscriber extends NotificationComponent {

    constructor(public name: string, public notifierService: NotifierService) {
        super(notifierService);
    }

    public processing(): boolean {
        return false;
    }

    public abstract processData(data: any): void;
}
