import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DfxUrl } from 'src/app/routes/name.routes';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-dms',
  templateUrl: './dms.view.html',
})
export class DmsComponent implements OnInit {
  config: any;
  public dmsURL: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.dmsURL = this.sanitizer.bypassSecurityTrustResourceUrl(DfxUrl.dmsDashboardUrl);
  }
}

