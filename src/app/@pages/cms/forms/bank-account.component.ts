import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CmsService } from 'src/app/services/cms.services';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-form-bank-account',
  templateUrl: './bank-account.view.html',
  providers: [DatePipe]
})
export class CmsFormBankAccountComponent implements OnInit {
  config: any;
  formData: FormGroup;
  submitted = false;
  alertVisible = false;
  alertData: { message: string; type: string };

  newBankAccountPath = DfxRoutes.newBankAccount;
  newClientSetupPath = DfxRoutes.newClientSetup;
  newEntityCreationPath = DfxRoutes.newEntityCreation;

  client_No: any;
  bank_Code: any;
  posting_Group: any;
  currency_Code: any;

  clientNo: any = [];
  bankCode: any = [];
  postingGroup: any = [];
  currencyCode: any = [];
  clientType: any = [];
  country: any = [];
  legalCode: any = [];
  nationality: any = [];
  profession: any = [];
  relationshipManger: any = [];
  trustDirector: any = [];
  firstPartitionCode: any = [];

  constructor(
    public cmsService: CmsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      clientNo: ['', Validators.required],
      bankCode: ['', Validators.required],
      name: ['', Validators.required],
      name2: [''],
      accountInNameOf: ['', Validators.required],
      bankAccountNo: ['', Validators.required],
      postingGroup: ['', Validators.required],
      currencyCode: ['', Validators.required],
      sortCode: ['', Validators.required],
      swiftCode: ['', Validators.required],
      iBAN: ['', Validators.required]
    });

    this.readbankCode();
    this.readclientNo();
    this.readcurrencyCode();
    this.readpostingGroup();
  }

  get f() {
    return this.formData.controls;
  }

  // Bank Code
  readbankCode() {
    this.cmsService.getBankCode().subscribe(data => {
      this.bankCode = data;
    });
  }
  bankCodeSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1 || item.Code.toLowerCase() === term;
  }

  // Clinet Number
  readclientNo() {
    this.cmsService.getClientLookup().subscribe(data => {
      this.clientNo = data;
    });
  }
  clientNoSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1 || item.Client_No.toLowerCase() === term;
  }
  // Posting Group
  readpostingGroup() {
    this.cmsService.getPostingGroup().subscribe(data => {
      this.postingGroup = data;
    });
  }
  PostingSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Code.toLowerCase().indexOf(term) > -1 || item.Description.toLowerCase() === term;
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

  createBankAccount() {
    this.submitted = true;
    console.log(this.formData.valid);
    if (this.formData.valid) {
      this.cmsService.postBankAccountData(this.formData.value).subscribe(data => {
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
