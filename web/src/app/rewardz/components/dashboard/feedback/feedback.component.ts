import {Component} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificationComponent} from "../../../../common/components/notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'feedback',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './feedback.html'
})

export class FeedbackComponent extends NotificationComponent {
    public feedbackForm: FormGroup;

    constructor(public router: Router, public notifierService: NotifierService, private fb: FormBuilder) {
        super(notifierService);
        this.feedbackForm = fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.email, Validators.required]],
            'subject': ['', Validators.required],
            'message': ['', Validators.required]
        });
    }


    public submitFeedback() {
        console.log('Here');
        // if (this.feedbackForm.valid) {
        //     console.log('Form submitted')
        // }
    }
}