import {DoBootstrap, NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {TosidropNavbarComponent} from "./tosidrop/components/navbar/tosidrop-navbar.component";
import {RewardzNavbarComponent} from "./rewardz/components/navbar/rewardz-navbar.component";
import {Route, RouterModule, Routes} from "@angular/router";
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

const routes: Route[] = [];

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, RouterModule.forRoot(routes),
        FormsModule, ReactiveFormsModule,
        ModalModule.forRoot(), TooltipModule.forRoot(), OverlayPanelModule,
        CheckboxModule, TableModule,
        DropdownModule, MenubarModule, DataViewModule, ImageModule,
        ButtonModule],
    entryComponents: [TosidropNavbarComponent, RewardzNavbarComponent],
    providers: [RestService, WalletObserverService, WalletService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})


export class AppModule implements DoBootstrap {

    ngDoBootstrap(app) {
        document.querySelector('#pre-load').remove();
        if (!window.location.pathname.toLowerCase().includes("tosidrop")) {
            console.log("tosidrop");
            const componentElement = document.createElement("tosidrop");
            document.body.appendChild(componentElement);
            import("./tosidrop/app-tosidrop.module");
            import("./tosidrop/app-tosidrop-routing.module");
            app.bootstrap(TosidropNavbarComponent);
        } else {
            console.log("rewardz");
            const componentElement = document.createElement("rewardz");
            document.body.appendChild(componentElement);
            import("./rewardz/app-rewardz.module");
            import("./rewardz/app-rewardz-routing.module");
            app.bootstrap(RewardzNavbarComponent);
        }
    }
}