import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CmsService } from 'src/app/services/cms.services';
import { DfxRoutes } from 'src/app/routes/name.routes';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cms-landing',
  templateUrl: './cms-landing.view.html',
  providers: [DatePipe]
})
export class CmsLandingComponent implements OnInit {
  config: any;

  newBankAccountPath = DfxRoutes.newBankAccount;
  newClientSetupPath = DfxRoutes.newClientSetup;
  newEntityCreationPath = DfxRoutes.newEntityCreation;

  constructor(
    public cmsService: CmsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {}
}
