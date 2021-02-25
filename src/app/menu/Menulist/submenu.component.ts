import { Component, OnInit, Input } from '@angular/core';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
})
export class SubMenuComponent implements OnInit {
  dashBoardPath = DfxRoutes.Dashboard;
  jobsPath = DfxRoutes.Jobs;
  classificationModelPath = DfxRoutes.ClassificationModels;
  classificationBuildModelPath = DfxRoutes.ClassificationBuildModels;
  classificationPublishModelPath = DfxRoutes.ClassificationPublishModels;
  searchenginePath = DfxRoutes.SearchEngine;
  hubLandingPath = DfxRoutes.hubLanding;
  cmsLandingPath = DfxRoutes.cmsLanding;
  dmsLandingPath = DfxRoutes.dmsLanding;
  newBankAccountPath = DfxRoutes.newBankAccount;
  newClientSetupPath = DfxRoutes.newClientSetup;
  newEntityCreationPath = DfxRoutes.newEntityCreation;

  config: any;
  @Input() dfx: boolean;
  @Input() dms: boolean;
  @Input() cms: boolean;
  @Input() hub: boolean;

  visible = false;
  subDrawer = { docShow: false, docSlide: '', selectedIndex: null };
  subModelDoc: any;
  subModel: any;
  drawerWidth: any;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.getRoute();
    this.hub = true;
  }

  getRoute() {
    if (
      this.router.url === '/' ||
      this.router.url === '/dashboard' ||
      this.router.url === '/discovery/jobs' ||
      this.router.url === '/classification/models' ||
      this.router.url === '/classification/models/build' ||
      this.router.url === '/classification/models/publish') {
      this.dfx = true;
      this.dms = false;
      this.cms = false;
      this.hub = false;
    }

    if (this.router.url === '/dms') {
      this.dfx = false;
      this.dms = true;
      this.cms = false;
      this.hub = false;
    }
    if (
      this.router.url === '/cms/forms/new/bank-account' ||
      this.router.url === '/cms/forms/new/client-setup' ||
      this.router.url === '/cms/forms/new/entity-creation'
    ) {
      this.dfx = false;
      this.dms = false;
      this.cms = true;
      this.hub = false;
    }
    if (
      this.router.url === '/myhub' ||
      this.router.url === '/myhub/calendar'
    ) {
      this.dfx = false;
      this.dms = false;
      this.cms = false;
      this.hub = true;
    }
    console.log(this.router.url)
  }

  get roleExist() {
    return localStorage.getItem('roles');
  }

  get showdata() {
    return localStorage.getItem('showmenu') === 'true';
  }

  get showadmin() {
    return localStorage.getItem('showadmin') === 'true';
  }

  get showanalyst() {
    return localStorage.getItem('showanalyst') === 'true';
  }

  open() {
    this.drawerWidth = { width: '900px' };
    this.visible = true;
  }

  closeDocShow() {
    this.subDrawer.docShow = false;
  }

  close() {
    this.drawerWidth = '';
    this.visible = false;
  }

}