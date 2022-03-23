import {DoBootstrap, NgModule} from '@angular/core';
import {Route, RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {MenubarModule} from "primeng/menubar";
import {DataViewModule} from "primeng/dataview";
import {ImageModule} from "primeng/image";
import {ButtonModule} from "primeng/button";
import {RestService} from "./common/services/rest.service";
import {WalletObserverService} from "./common/services/wallet-observer.service";
import {BrowserModule} from "@angular/platform-browser";
import {WalletService} from "./common/services/wallet.service";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {RwdNavbarComponent} from "./rewardz/components/navbar/rwd-navbar.component";
import {TosidropNavbarComponent} from "./tosidrop/components/navbar/tosidrop-navbar.component";

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
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule.forRoot(routes),
        FormsModule, ReactiveFormsModule,
        NotifierModule.withConfig(customNotifierOptions),
        ModalModule.forRoot(), TooltipModule.forRoot(), OverlayPanelModule,
        CheckboxModule, TableModule,
        DropdownModule, MenubarModule, DataViewModule, ImageModule,
        ButtonModule],
    entryComponents: [RwdNavbarComponent, TosidropNavbarComponent],
    providers: [RestService, WalletObserverService, WalletService]
})


export class AppModule implements DoBootstrap {

    ngDoBootstrap(app) {
        document.querySelector('#pre-load').remove();
        if (window.location.hostname.toLowerCase().includes("tosidrop")) {
            const componentElement = document.createElement("tosidrop");
            document.body.appendChild(componentElement);
            import("./tosidrop/app-tosidrop.module");
            app.bootstrap(TosidropNavbarComponent);
        } else {
            const componentElement = document.createElement("rewardz");
            document.body.appendChild(componentElement);
            import("./rewardz/app-rewardz.module");
            app.bootstrap(RwdNavbarComponent);
        }
    }
}