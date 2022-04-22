import {Component, Inject} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {DisclosureButton} from "./disclosure-button";

@Component({
    selector: 'faq',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './faq.html'
})

export class FaqComponent {
    public buttons: Map<string, DisclosureButton> = new Map<string, DisclosureButton>();

    constructor(@Inject(DOCUMENT) public document: any, public titleService: Title) {
        this.titleService.setTitle("FAQ");
        setTimeout(() => {
            while (this.document.getElementsByClassName("toggleButton").length === 0) {
                this.delay(100);
            }
            const buttons = this.document.getElementsByClassName("toggleButton");
            for (let i = 0; i < buttons.length; i++) {
                const button = new DisclosureButton(buttons[i]);
                this.buttons.set(button.id, button);
            }
        });
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
}