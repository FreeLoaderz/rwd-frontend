import {Component, ViewChild} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificationComponent} from "../notification/notification.component";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Title} from "@angular/platform-browser";
import {RestService} from "../../services/rest.service";
import {PulldownField} from "../../data/pulldown-field";


@Component({
    selector: 'register',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './register.html'
})

export class RegisterComponent extends NotificationComponent {
    public registerForm: FormGroup;
    public distoOptions: PulldownField;
    public defaultErrorMessage: string = "Could not submit your project. If it continues, please email us at <a class=\"notifier__notification-message\" href=\"mailto:info@smartclaimz.io\">info@smartclaimz.io</a>";
    @ViewChild('notificationTemplate', {static: false}) public notificationTemplate: any;

    constructor(public router: Router, public titleService: Title, public notifierService: NotifierService, private fb: FormBuilder,
                public restService: RestService) {
        super(notifierService);
        this.distoOptions = new PulldownField(false, false, false);
        this.distoOptions.addOption("*Select the token distribution method", null);
        this.distoOptions.addOption("Weighted - based on how much ADA is staked to a pool", "Weighted+-+based+on+how+much+ADA+is+staked+to+a+pool");
        this.distoOptions.addOption("Evenly distributed amongst provided list of stake pools", "Evenly+distributed+amongst+provided+list+of+stake+pools");

        this.registerForm = fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.email, Validators.required]],
            'project': ['', Validators.required],
            'projectUrl': ['', [Validators.required, Validators.pattern(/^http.*$/)]],
            'projectDescription': ['', Validators.required],
            'twitter': ['', Validators.required],
            'discord': [''],
            'linkedIn': [''],
            'instagram': [''],
            'facebook': [''],
            'tokenName': ['', Validators.required],
            'policyId': ['', Validators.required],
            'tokenDescription': ['', Validators.required],
            'tokenUrl': ['', [Validators.required, Validators.pattern(/^http.*$/)]],
            'decimals': ['', Validators.pattern(/^[0-9]+$/)],
            'distroMethod': ['', Validators.required],
            'bech32Url': ['']
        });
        this.titleService.setTitle("Project Registration");
    }


    /**
     * Submit the feedback
     */
    public submitRegistration() {
        if (this.registerForm.valid) {
            this.restService.submitRegistration(this.registerForm).subscribe(statusCode => {
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
            this.successNotification("Thank you for submitting your registration. We'll contact you!");
            this.registerForm.reset();
        } else {
            this.customNotification("error", this.defaultErrorMessage, this.notificationTemplate);
        }
    }
}