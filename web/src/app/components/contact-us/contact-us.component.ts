import {Component} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'contact-us',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './contact-us.html'
})

export class ContactUsComponent extends NotificationComponent {
    public contactUsForm: FormGroup;

    constructor(public router: Router,  public titleService: Title, public notifierService: NotifierService, private fb: FormBuilder) {
        super(notifierService);
        this.contactUsForm = fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.email, Validators.required]],
            'subject': ['', Validators.required],
            'message': ['', Validators.required]
        });
        this.titleService.setTitle("Contact Us");

    }


    public submitFeedback() {
        if (this.contactUsForm.valid) {
            console.log(this.contactUsForm.value);
        }
    }
}