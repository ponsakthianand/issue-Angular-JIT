import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CmsService } from 'src/app/services/cms.services';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-form-entity-creation',
  templateUrl: './entity-creation.view.html',
  providers: [DatePipe]
})
export class CmsFormEntityCreationComponent implements OnInit {
  @ViewChild('dateRangeValue') dateRangeValue: ElementRef;
  public daterange: any = {};
  public datePickerOptions: any = {
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format('YYYY'), 10),
    autoApply: true,
    locale: { format: 'DD-MM-YYYY' }
  };

  config: any;
  formData: FormGroup;
  submitted = false;
  alertVisible = false;
  alertData: { message: string; type: string };

  newBankAccountPath = DfxRoutes.newBankAccount;
  newClientSetupPath = DfxRoutes.newClientSetup;
  newEntityCreationPath = DfxRoutes.newEntityCreation;

  profession: any = [];
  country: any = [];

  profe_ssion: any;
  Ccount_ry: any;
  Ncount_ry: any;
  Rcount_ry: any;
  Jcount_ry: any;
  perso: any;

  personalCOrporate = ['Personal', 'Corporate'];

  constructor(
    public cmsService: CmsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      name: ['', Validators.required],
      name2: [''],
      DOB: ['', Validators.required],
      nationality: ['', Validators.required],
      profession: ['', Validators.required],
      Residence: ['', Validators.required],
      personel: ['', Validators.required],
      Jurisdiction: [''],
      countyIncorporate: [''],
      IncorporationDate: [''],
      IsOwner: [false],
      IsBank: [false]
    });

    this.readCountry();
    this.readprofession();
  }

  get f() {
    return this.formData.controls;
  }

  // Country of Incorporation
  readCountry() {
    this.cmsService.getCountry().subscribe(data => {
      this.country = data;
    });
  }
  countrySearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1 || item.Code.toLowerCase() === term;
  }

  // Proffession
  readprofession() {
    this.cmsService.getProfession().subscribe(data => {
      this.profession = data;
    });
  }
  ProfesstionSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Code.toLowerCase().indexOf(term) > -1 || item.Name.toLowerCase() === term;
  }

  createEntity() {
    this.submitted = true;
    console.log(this.formData.valid);
    if (this.formData.valid) {
      this.cmsService.postEntityCreationData(this.formData.value).subscribe(data => {
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
