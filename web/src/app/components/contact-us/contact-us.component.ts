import {Component, ViewChild} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";
import {RestService} from "../../services/rest.service";


@Component({
    selector: 'contact-us',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './contact-us.html'
})

export class ContactUsComponent extends NotificationComponent {
    public contactUsForm: FormGroup;
    public defaultErrorMessage: string = "Could not submit your feedback. If it continues, please email us at <a class=\"notifier__notification-message\" href=\"mailto:info@smartclaimz.io\">info@smartclaimz.io</a>";
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;


    constructor(public router: Router, public titleService: Title, public notifierService: NotifierService, private fb: FormBuilder,
                public restService: RestService) {
        super(notifierService);
        this.contactUsForm = fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.email, Validators.required]],
            'subject': ['', Validators.required],
            'message': ['', Validators.required]
        });
        this.titleService.setTitle("Contact Us");
    }


    /**
     * Submit the feedback
     */
    public submitFeedback() {
        if (this.contactUsForm.valid) {
            this.restService.submitFeedback(this.contactUsForm).subscribe(statusCode => {
                this.processResponse(statusCode);
            });
        }
    }

    /**
     * Process the return code
     * @param statusCode
     */
    public processResponse(statusCode: any) {
        if (statusCode === 200) {
            this.successNotification("Thank you for your feedback!");
            this.contactUsForm.reset();
        } else {
            this.customNotification("error", this.defaultErrorMessage, this.notificationTemplate);
        }
    }
}