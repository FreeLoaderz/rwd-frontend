import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RewardsComponent} from "./components/dashboard/rewards/rewards.component";
import {HistoryComponent} from "./components/dashboard/history/history.component";
import {FeedbackComponent} from "./components/dashboard/feedback/feedback.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {path: '', redirectTo: 'rewards', pathMatch: 'full'},
            {path: 'rewards', component: RewardsComponent},
            {path: 'history', component: HistoryComponent},
            {path: 'feedback', component: FeedbackComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        preloadingStrategy: PreloadAllModules,
        scrollPositionRestoration: "enabled"
    })],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
