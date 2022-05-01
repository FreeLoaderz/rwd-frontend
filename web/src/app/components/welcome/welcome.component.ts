import {AfterViewInit, Component, Inject} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {RestService} from "../../services/rest.service";

@Component({
    selector: 'welcome',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './welcome.html'
})
/**
 * Main Dashboard for the queries
 */
export class WelcomeComponent implements AfterViewInit {

    constructor(@Inject(DOCUMENT) private document: any, public titleService: Title,
                public restService: RestService) {
        this.titleService.setTitle("SmartClaimz");
    }

    public ngAfterViewInit() {
        this.restService.testNewEndpoint().then(res => this.processResult(res))
            .catch(e => this.processError(e));
    }

    processResult(res: any) {
        if ((res != null) && (res.msg != null)) {
            RestService.useNewEndpoints = true;
        } else {
            RestService.useNewEndpoints = false;
        }
    }

    processError(res: any) {
        if ((res != null) && (res.status != null) && (res.status === 406)) {
            RestService.useNewEndpoints = true;
        } else {
            RestService.useNewEndpoints = false;
        }
    }

    scrollToElement(element): void {
        this.document.getElementById(element).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
}