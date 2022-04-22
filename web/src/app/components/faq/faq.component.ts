import {Component, Inject} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'faq',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './faq.html'
})

export class FaqComponent {

    constructor(@Inject(DOCUMENT) private document: any, public titleService: Title) {
        this.titleService.setTitle("FAQ");
    }
}