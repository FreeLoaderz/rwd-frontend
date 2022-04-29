import {Component, Injectable} from "@angular/core";

@Component({
    selector: 'footer',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: './footer.html',
})
@Injectable()
/**
 *
 */
export class FooterComponent {

    constructor() {
    }

    public compressionLevel(): number {
        if (window.innerWidth > 900) {
            return 0;
        } else if (window.innerWidth > 400) {
            return 1;
        }
        return 2;
    }
}