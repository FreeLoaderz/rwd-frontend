import {NgModule} from '@angular/core';
import {RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {RewardsComponent} from "./components/rewards/rewards.component";
import {HistoryComponent} from "./components/history/history.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {FaqComponent} from './components/faq/faq.component';
import {DelegateComponent} from "./components/delegate/delegate.component";
import {TosComponent} from "./components/tos/tos.component";
import {BankManagerComponent} from "./components/extensions/meld/bank-manager.component";
import {TokensComponent} from "./components/tokens/tokens.component";


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
    },
    {
        path: 'delegate', component:
        DelegateComponent
    },
    {
        path: 'tokens', component:
        TokensComponent
    },
    {
        path: 'tos', component:
        TosComponent
    },
    {
        path: 'bank-manager', component:
        BankManagerComponent
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
