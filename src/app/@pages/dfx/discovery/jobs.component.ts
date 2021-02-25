import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DfxUrl } from 'src/app/routes/name.routes';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.view.html'
})
export class JobsComponent implements OnInit {
  config: any;
  public dmsURL: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.dmsURL = this.sanitizer.bypassSecurityTrustResourceUrl(DfxUrl.DiscoveryURL);
  }
}
