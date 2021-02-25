import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DfxRoutes } from 'src/app/routes/name.routes';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-404',
  templateUrl: './404.view.html',
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }
}
