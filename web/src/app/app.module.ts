import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {TableModule} from "primeng/table";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {RouterModule} from "@angular/router";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DropdownModule} from "primeng/dropdown";
import {MenubarModule} from "primeng/menubar";
import {CheckboxModule} from "primeng/checkbox";
import {DataViewModule} from "primeng/dataview";
import {FooterComponent} from "./components/footer/footer.component";
import {RestService} from "./services/rest.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ImageModule} from "primeng/image";
import {InfoComponent} from "./components/welcome/info/info.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RewardsComponent} from "./components/dashboard/rewards/rewards.component";
import {FeedbackComponent} from "./components/dashboard/feedback/feedback.component";
import {HistoryComponent} from "./components/dashboard/history/history.component";
import {WalletObserverService} from "./services/wallet-observer.service";

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'right',
            distance: 12
        },
        vertical: {
            position: 'bottom',
            distance: 12,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: false,
        stacking: 5
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },

        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },

        shift: {
            speed: 300,
            easing: 'ease' // All standard CSS easing methods work
        },
        overlap: 150
    }
};

@NgModule({
    declarations: [WelcomeComponent, NavbarComponent, FooterComponent, InfoComponent, DashboardComponent, RewardsComponent,
    FeedbackComponent, HistoryComponent],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, RouterModule,
        ModalModule.forRoot(), TooltipModule.forRoot(), OverlayPanelModule, DragDropModule,
        BrowserAnimationsModule, HttpClientModule, CheckboxModule, TableModule,
        DropdownModule, MenubarModule, DataViewModule, ButtonModule, RippleModule, ImageModule,
        NotifierModule.withConfig(customNotifierOptions),
    ],
    bootstrap: [NavbarComponent],
    providers: [RestService, WalletObserverService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }]
})
export class AppModule {
}
