import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {NavbarComponent} from "./navbar/navbar.component";
import {TableModule} from "primeng/table";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {RouterModule} from "@angular/router";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {SystemService} from "./common/system.service";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DropdownModule} from "primeng/dropdown";
import {MenubarModule} from "primeng/menubar";
import {CheckboxModule} from "primeng/checkbox";
import {DataViewModule} from "primeng/dataview";
import {FooterComponent} from "./common/components/footer.component";
import {RestService} from "./common/rest.service";

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
    declarations: [DashboardComponent, NavbarComponent, FooterComponent],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, RouterModule,
        ModalModule.forRoot(), TooltipModule.forRoot(), OverlayPanelModule, DragDropModule,
        BrowserAnimationsModule, HttpClientModule, CheckboxModule, TableModule,
        DropdownModule, MenubarModule, DataViewModule,
        NotifierModule.withConfig(customNotifierOptions),
    ],
    bootstrap: [NavbarComponent],
    providers: [SystemService, RestService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }]
})
export class AppModule {
}
