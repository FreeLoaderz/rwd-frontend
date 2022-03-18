import {Component, OnInit} from '@angular/core';
import {Router, Routes} from "@angular/router";
import {TosidropWelcomeComponent} from "../welcome/tosidrop-welcome.component";

@Component({
    selector: 'tosidrop',
    templateUrl: './tosidrop-navbar.html',
    styleUrls: ['../../styles/navbar.css'],
})

/**
 * Navigation Bar rewards
 */
export class TosidropNavbarComponent implements OnInit {

    constructor(public router: Router) {
    }

    ngOnInit() {
        const routes: Routes = [
            {
                path: '',
                redirectTo: '/welcome',
            },
            {
                path: '/welcome',
                component: TosidropWelcomeComponent,
            }
        ];
        this.router.resetConfig([...routes]);
        console.log(this.router.config);

    }
}