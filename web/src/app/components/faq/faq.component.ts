import {AfterViewInit, Component, Inject} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {DisclosureButton} from "./disclosure-button";
import {Router} from "@angular/router";

@Component({
    selector: 'faq',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './faq.html'
})

export class FaqComponent implements AfterViewInit {
    public buttons: Map<string, DisclosureButton> = new Map<string, DisclosureButton>();

    constructor(@Inject(DOCUMENT) public document: any, public router: Router,
                public titleService: Title) {
        this.titleService.setTitle("FAQ");
    }

    public ngAfterViewInit() {
        const buttons = this.document.getElementsByClassName("toggleButton");
        for (let i = 0; i < buttons.length; i++) {
            const button = new DisclosureButton(buttons[i]);
            this.buttons.set(button.id, button);
        }
    }

    public toggleComponent(id: string) {
        this.buttons.forEach(button => {
            if (button.id !== id) {
                button.hideContent();
            } else {
                button.toggleExpand();
            }
        });
    }

    public delegate() {
        this.router.navigate(['/delegate']);
    }
}