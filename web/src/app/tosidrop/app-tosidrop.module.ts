import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {NgModule} from "@angular/core";
import {TosidropWelcomeComponent} from "./components/welcome/tosidrop-welcome.component";
import {RestService} from "../common/services/rest.service";
import {WalletObserverService} from "../common/services/wallet-observer.service";
import {AppTosidropRoutingModule} from "./app-tosidrop-routing.module";
import {ImageModule} from "primeng/image";
import {ModalModule} from "ngx-bootstrap/modal";
import {TosidropNavbarComponent} from "./components/navbar/tosidrop-navbar.component";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {HttpClientModule} from "@angular/common/http";
import {RewardzNavbarComponent} from "../rewardz/components/navbar/rewardz-navbar.component";
import {Route, RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {MenubarModule} from "primeng/menubar";
import {DataViewModule} from "primeng/dataview";
import {ButtonModule} from "primeng/button";
import {WalletService} from "../common/services/wallet.service";

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

const routes: Route[] = [];

@NgModule({
    declarations: [TosidropNavbarComponent, TosidropWelcomeComponent],
    imports: [CommonModule, ModalModule.forRoot(), RouterModule.forRoot(routes),
        NotifierModule.withConfig(customNotifierOptions),
        RouterModule, FormsModule, ReactiveFormsModule,
        ModalModule.forRoot(), TooltipModule.forRoot(), OverlayPanelModule,
        CheckboxModule, TableModule,
        DropdownModule, MenubarModule, DataViewModule, ImageModule,
        ButtonModule],
    providers: [RestService, WalletObserverService, WalletService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    entryComponents: [TosidropNavbarComponent],
})
export class AppTosidropModule {
}
