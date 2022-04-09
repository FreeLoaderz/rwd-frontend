import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'welcome',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './welcome.html'
})
/**
 * Main Dashboard for the queries
 */
export class WelcomeComponent {

    constructor(public titleService: Title) {
        this.titleService.setTitle("Smart Claimz");
    }
}