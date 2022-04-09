import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {RewardsComponent} from "./components/dashboard/rewards/rewards.component";
import {HistoryComponent} from "./components/dashboard/history/history.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TestnetComponent} from "./components/testnet/testnet.component";


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
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {path: '', redirectTo: 'rewards', pathMatch: 'full'},
            {path: 'rewards', component: RewardsComponent},
            {path: 'history', component: HistoryComponent}
        ]
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
