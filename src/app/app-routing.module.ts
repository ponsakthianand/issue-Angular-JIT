import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassificationBuildModelsComponent } from './@pages/dfx/classification/build-models.component';
import { ClassificationModelsComponent } from './@pages/dfx/classification/models.component';
import { ClassificationPublishModelsComponent } from './@pages/dfx/classification/publish-models.component';
import { DashboardComponent } from './@pages/dfx/dashboard/dashboard.component';
import { JobsComponent } from './@pages/dfx/discovery/jobs.component';
import { SearchengineComponent } from './@pages/dfx/searchengine/searchengine.component';
import { AccountGuard } from './services/account.gaurd';
import { HubComponent } from './@pages/hub/hub-landing.component';
import { HubCalendarComponent } from './@pages/hub/calendar.component';
import { CmsFormBankAccountComponent } from './@pages/cms/forms/bank-account.component';
import { CmsFormClientSetupComponent } from './@pages/cms/forms/client-setup.component';
import { CmsFormEntityCreationComponent } from './@pages/cms/forms/entity-creation.component';
import { CmsLandingComponent } from './@pages/cms/cms-landing.component';
import { DmsComponent } from './@pages/dms/dms.component';
import { PageNotFoundComponent } from './@pages/404/404.component';
import { LoginComponent } from './@pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { title: 'Login | DFX Suite' },
  },
  {
    path: 'searchengine',
    component: SearchengineComponent,
    data: { title: 'DFX Search Engine | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'DFX Dashboard | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'discovery/jobs',
    component: JobsComponent,
    data: { title: 'Jobs - DFX Discovery | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'classification/models',
    component: ClassificationModelsComponent,
    data: { title: 'Models - DFX Classification | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'classification/models/publish',
    component: ClassificationPublishModelsComponent,
    data: { title: 'Publish Models - DFX Classification | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'classification/models/build',
    component: ClassificationBuildModelsComponent,
    data: { title: 'Build Models - DFX Classification | DFX Suite' },
    canActivate: [AccountGuard],
  },
  {
    path: 'myhub',
    component: HubComponent,
    data: { title: 'My Hub | DFX Suite' },
    canActivate: [AccountGuard]
  },
  // {
  //   path: 'myhub/calendar',
  //   component: HubCalendarComponent,
  //   data: { title: 'Calendar | DFX Suite' },
  //   canActivate: [AccountGuard]
  // },
  {
    path: 'dms',
    component: DmsComponent,
    data: { title: 'DMS | DFX Suite' },
    canActivate: [AccountGuard]
  },
  {
    path: 'cms',
    component: CmsLandingComponent,
    data: { title: 'CMS | DFX Suite' },
    canActivate: [AccountGuard]
  },
  {
    path: 'cms/forms/new/bank-account',
    component: CmsFormBankAccountComponent,
    data: { title: 'Bank Account | DFX Suite' },
    canActivate: [AccountGuard]
  },
  {
    path: 'cms/forms/new/client-setup',
    component: CmsFormClientSetupComponent,
    data: { title: 'Client Setup | DFX Suite' },
    canActivate: [AccountGuard]
  },
  {
    path: 'cms/forms/new/entity-creation',
    component: CmsFormEntityCreationComponent,
    data: { title: 'Entity Creation | DFX Suite' },
    canActivate: [AccountGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
