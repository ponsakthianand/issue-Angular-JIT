import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CmsService } from 'src/app/services/cms.services';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-form-client-setup',
  templateUrl: './client-setup.view.html',
  providers: [DatePipe]
})
export class CmsFormClientSetupComponent implements OnInit {
  config: any;
  formData: FormGroup;
  submitted = false;
  alertVisible = false;
  alertData: { message: string; type: string };

  newBankAccountPath = DfxRoutes.newBankAccount;
  newClientSetupPath = DfxRoutes.newClientSetup;
  newEntityCreationPath = DfxRoutes.newEntityCreation;

  clientType: any = [];
  currencyCode: any = [];
  legalCode: any = [];
  firstPartitionCode: any = [];
  trustDirector: any = [];
  relationshipManger: any = [];
  accountant: any = [];
  assitrelationmanager: any = [];
  administr: any = [];
  clientactivgroup: any = [];

  assitrela_tionmanager: any;
  adminis_tr: any;
  clientac_tivgroup: any;

  client_Type: any;
  currency_Code: any;
  legal_Code: any;
  first_PartitionCode: any;
  trust_Director: any;
  relationship_Manger: any;
  accountan_t: any;

  constructor(
    public cmsService: CmsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      name: ['', Validators.required],
      clienttype: ['', Validators.required],
      clientformalname: ['', Validators.required],
      currencycode: ['', Validators.required],
      legalcode: ['', Validators.required],
      firstpartioncode: ['', Validators.required],
      secondpartioncode: [''],
      trustdirector: ['', Validators.required],
      relationmanager: ['', Validators.required],
      assistrelationmanger: [''],
      administrator: [''],
      accountant: [''],
      clientgroup: [''],
      createfiscalyear: [false],
      insertaddress: [false]
    });

    this.readclientType();
    this.readcurrencyCode();
    this.readlegalCode();
    this.readrelationshipManger();
    this.readtrustDirector();
    this.readfirstPartitionCode();
    this.readAccountant();
    this.readArmCode();
    this.readAdminCode();
    this.readClientGroupCode();
  }

  get f() {
    return this.formData.controls;
  }

  // Relationship Manager
  readrelationshipManger() {
    this.cmsService.getDimentionCode('Manager').subscribe(data => {
      this.relationshipManger = data;
    });
  }

  // Trust Manager
  readtrustDirector() {
    this.cmsService.getDimentionCode('Dir').subscribe(data => {
      this.trustDirector = data;
    });
  }

  // Accountant
  readAccountant() {
    this.cmsService.getDimentionCode('Account').subscribe(data => {
      this.accountant = data;
    });
  }

  // Legal Code
  readlegalCode() {
    this.cmsService.getDimentionCode('Legal').subscribe(data => {
      this.legalCode = data;
    });
  }

  // Assistant Relationship Manager
  readArmCode() {
    this.cmsService.getDimentionCode('ARM').subscribe(data => {
      this.assitrelationmanager = data;
    });
  }

  // Administrator
  readAdminCode() {
    this.cmsService.getDimentionCode('Admin').subscribe(data => {
      this.administr = data;
    });
  }

  // Client Active group
  readClientGroupCode() {
    this.cmsService.getDimentionCode('CLIENTGROUP').subscribe(data => {
      this.clientactivgroup = data;
    });
  }

  // getDimentionCode Search
  getDimentionCodeSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Code.toLowerCase().indexOf(term) > -1 || item.Name.toLowerCase() === term;
  }

  // First partition Code
  readfirstPartitionCode() {
    this.cmsService.getFirstPartionCode().subscribe(data => {
      this.firstPartitionCode = data;
    });
  }
  PartitionCodeSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Code.toLowerCase().indexOf(term) > -1 || item.description.toLowerCase() === term;
  }

  // Clinet Type
  readclientType() {
    this.cmsService.getClientType().subscribe(data => {
      this.clientType = data;
    });
  }
  clientTypeSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Code.toLowerCase().indexOf(term) > -1 || item.description.toLowerCase() === term;
  }

  // Currency COde
  readcurrencyCode() {
    this.cmsService.getCurrencyCode().subscribe(data => {
      this.currencyCode = data;
    });
  }
  CurrencySearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.description.toLowerCase().indexOf(term) > -1 || item.currencycode.toLowerCase() === term;
  }


  createClientSetup() {
    this.submitted = true;
    console.log(this.formData.valid);
    if (this.formData.valid) {
      this.cmsService.postClientData(this.formData.value).subscribe(data => {
        this.submitted = false;
        this.alertVisible = true;
        this.alertData = { message: data, type: 'success' };
        this.formData.reset();
        setTimeout(() => {
          this.alertVisible = false;
        }, 4000);
      },
        error => {
          this.alertVisible = true;
          this.alertData = { message: 'Something went wrong!', type: 'error' };
          setTimeout(() => {
            this.alertVisible = false;
          }, 4000);
        });
    }
    console.log(this.formData.value);
  }

  cancel() {
    this.alertVisible = false;
  }
}
