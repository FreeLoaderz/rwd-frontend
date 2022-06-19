import {Component, EventEmitter, Injectable, Output} from "@angular/core";

@Component({
    selector: 'tos',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './tos.html',
})
@Injectable()
export class TosComponent {
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();

    constructor() {

    }

    public hideTermsModal() {
        this.notify.emit();
    }

    public downloadModal() {
        this.hideTermsModal();
        window.open('assets/SmartClaimz-Terms_of_Service.pdf');
    }
}