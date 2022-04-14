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

    public compress(): boolean {
        if (window.innerWidth < 1000) {
            return true;
        }
        return false;
    }
}