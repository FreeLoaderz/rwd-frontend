import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {RewardsComponent} from "./components/dashboard/rewards/rewards.component";
import {HistoryComponent} from "./components/dashboard/history/history.component";
import {FeedbackComponent} from "./components/dashboard/feedback/feedback.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RewardzWelcomeComponent} from "./components/welcome/rewardz-welcome.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/welcome',
    },
    {
        path: '/welcome',
        component: RewardzWelcomeComponent,
    },
    {
        path: '/dashboard',
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
        scrollPositionRestoration: "enabled"
    })],
    exports: [RouterModule]
})

export class AppRewardzRoutingModule {
}
