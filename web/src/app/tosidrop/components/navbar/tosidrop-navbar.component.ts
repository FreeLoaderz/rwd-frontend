import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TosidropWelcomeComponent} from "../welcome/tosidrop-welcome.component";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'tosidrop',
    templateUrl: './tosidrop-navbar.html',
    styleUrls: ['../../styles/navbar.css'],
})

/**
 * Navigation Bar rewards
 */
export class TosidropNavbarComponent {

    constructor(public router: Router, public titleService: Title) {
        this.titleService.setTitle("TosiDrop");
        this.router.config.push( {
            path: '',
            redirectTo: '/welcome',
        });
        this.router.config.push( {
            path: '/welcome',
            component: TosidropWelcomeComponent,
        });
        console.log(this.router.config);
    }
}