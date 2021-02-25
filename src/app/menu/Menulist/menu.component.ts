import { Component, OnInit, Output } from '@angular/core';
import { DfxRoutes, ClientBase } from 'src/app/routes/name.routes';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
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

  eDiscoveryMenu = ClientBase.eDiscoveryMenu;
  myHubMenu = ClientBase.myHubMenu;
  businessCentralMenu = ClientBase.businessCentralMenu;
  dmsMenu = ClientBase.dmsMenu;
  config: any;

  @Output() dfx: boolean;
  @Output() dms: boolean;
  @Output() cms: boolean;
  @Output() hub: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() { }

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

  expandNavigation(parent: any) {
    switch (parent) {
      case 'dfx':
        {
          this.dfx = true;
          this.dms = false;
          this.cms = false;
          this.hub = false;
        }
        break;
      case 'dms':
        {
          this.dfx = false;
          this.dms = true;
          this.cms = false;
          this.hub = false;
        }
        break;
      case 'cms':
        {
          this.dfx = false;
          this.dms = false;
          this.cms = true;
          this.hub = false;
        }
        break;
      case 'hub':
        {
          this.dfx = false;
          this.dms = false;
          this.cms = false;
          this.hub = true;
        }
        break;
    }
  }
}