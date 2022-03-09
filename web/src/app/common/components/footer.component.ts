import {Component, Injectable} from "@angular/core";

@Component({
    selector: 'footer',
    styleUrls: ['../../../styles/page-content.css'],
    templateUrl: '../../templates/common/footer.html',
})
@Injectable()
/**
 *
 */
export class FooterComponent {
    public year: number;

    constructor() {
        const now = new Date();
        this.year = now.getFullYear();
    }
}