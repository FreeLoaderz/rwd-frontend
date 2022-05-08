import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {RewardsComponent} from "./components/rewards/rewards.component";
import {HistoryComponent} from "./components/history/history.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {TestnetComponent} from "./components/testnet/testnet.component";
import {FaqComponent} from './components/faq/faq.component';
import {MaintenanceComponent} from "./components/maintenance/maintenance.component";


const routes: Routes = [
    {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
    },
    {
        path: 'testnet',
        component: TestnetComponent,
    },
    {
        path: 'contact-us',
        component: ContactUsComponent,
    },
    {
        path: 'faq',
        component: FaqComponent
    },
    {
        path: 'rewards',
        component: RewardsComponent
    },
    {
        path: 'history', component:
        HistoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        scrollPositionRestoration: "enabled"
    })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
