import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TosidropWelcomeComponent} from "./components/welcome/tosidrop-welcome.component";

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

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: "enabled"
    })],
    exports: [RouterModule]
})

export class AppTosidropRoutingModule {
}
