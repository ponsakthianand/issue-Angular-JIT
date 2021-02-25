import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClassificationBuildModelsComponent } from './@pages/dfx/classification/build-models.component';
import { ClassificationModelsComponent } from './@pages/dfx/classification/models.component';
import { ClassificationPublishModelsComponent } from './@pages/dfx/classification/publish-models.component';
import { DashboardComponent } from './@pages/dfx/dashboard/dashboard.component';
import { JobsComponent } from './@pages/dfx/discovery/jobs.component';
import { SearchengineComponent } from './@pages/dfx/searchengine/searchengine.component';
import { AlertComponent } from './@partials/alert.component';
import { ConfirmationComponent } from './@partials/confirmation.component';
import { DrawerComponent } from './@partials/drawer.component';
import { LoadingAndErrorComponent } from './@partials/loading-and-error.component';
import { HubComponent } from './@pages/hub/hub-landing.component';
import { HubCalendarComponent } from './@pages/hub/calendar.component';
// Routing Module
import { AppRoutingModule } from './app-routing.module';
// Pages Component
import { AppComponent } from './app.component';
import { Footer } from './global/footer/footer.component';
import { MenuComponent } from './menu/Menulist/menu.component';
import { TopNavBarComponent } from './menu/top-nav-bar/top-nav-bar.component';
import { AccountGuard } from './services/account.gaurd';
import { ClassificationService } from './services/classification.services';
// Service Modules
import { DashboardService } from './services/dashboard.services';
import { SearchService } from './services/search.services';
import { DmsService } from './services/dms.services';
// Common Module
import { SharedModule } from './shared/shared.module';
import { CmsFormEntityCreationComponent } from './@pages/cms/forms/entity-creation.component';
import { CmsFormClientSetupComponent } from './@pages/cms/forms/client-setup.component';
import { CmsFormBankAccountComponent } from './@pages/cms/forms/bank-account.component';
import { CmsLandingComponent } from './@pages/cms/cms-landing.component';
import { DmsComponent } from './@pages/dms/dms.component';
import { PageNotFoundComponent } from './@pages/404/404.component';
import { SubMenuComponent } from './menu/Menulist/submenu.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './@pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchengineComponent,
    DashboardComponent,
    JobsComponent,
    ClassificationModelsComponent,
    ClassificationBuildModelsComponent,
    ClassificationPublishModelsComponent,
    ConfirmationComponent,
    LoadingAndErrorComponent,
    AlertComponent,
    DrawerComponent,
    MenuComponent,
    TopNavBarComponent,
    Footer,
    HubComponent,
    HubCalendarComponent,
    DmsComponent,
    CmsLandingComponent,
    CmsFormEntityCreationComponent,
    CmsFormClientSetupComponent,
    CmsFormBankAccountComponent,
    PageNotFoundComponent,
    SubMenuComponent,
  ],
  imports: [AppRoutingModule, SharedModule, NgxSpinnerModule, BrowserAnimationsModule],
  exports: [
    ConfirmationComponent,
    LoadingAndErrorComponent,
    AlertComponent,
    SharedModule,
  ],
  providers: [
    SearchService,
    DashboardService,
    ClassificationService,
    AccountGuard,
    DmsService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
