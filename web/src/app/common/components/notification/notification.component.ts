import {NotifierService} from "angular-notifier";

export abstract class NotificationComponent {
    private readonly notifier: NotifierService;

    protected constructor(public notifierService: NotifierService) {
        this.notifier = notifierService;
    }

    defaultNotification(message: string) {
        this.notifier.notify('default', message);
    }

    errorNotification(message: string) {
        this.notifier.notify('error', message);
    }

    infoNotification(message: string) {
        this.notifier.notify('info', message);
    }

    successNotification(message: string) {
        this.notifier.notify('success', message);
    }

    warnNotification(message: string) {
        this.notifier.notify('warn', message);
    }

    showNotification(data: any) {
        if ((data == null) || (data.status == null) || (data.status === 200)) {
            this.createNotification(data);
        } else if (data.status === 404) {
            this.errorNotification('The server/page was not found! Verify your connection.');
        } else if (data.status === 400) {
            this.errorNotification('Missing or invalid request data was sent');
        } else if (data.status === 503) {
            this.errorNotification('Service is unavailable');
        } else if (data.status === 502) {
            this.errorNotification('Error reading from remote! Verify your connection.');
        } else if ((data.error) && (data.error !== '')) {
            this.errorNotification(data.error);
        } else {
            this.errorNotification('Unknown error occured. Verify network connection and that the server is available');
        }
    }

    createNotification(data: any) {
        if ((data == null) || (data.error == null) || (data.status === 200)) {
            this.successNotification('Success!');
        } else {
            this.errorNotification(data.error);
        }
    }

    handleError(error: any) {
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Unknown Server error';
        this.errorNotification(errMsg);
    }
}