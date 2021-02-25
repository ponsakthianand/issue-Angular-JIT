import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as User from './models/user-preference';
import { DfxRoutes } from './routes/name.routes';
import { LoginService } from './services/login.service';
import dayGridPlugin from '@fullcalendar/daygrid';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  // Fullcalender
  calendarPlugins = [dayGridPlugin]; // important!

  @ViewChild('topBar') topBar;
  title = 'DXFSuite';
  isLoggedIn$: Observable<boolean>;
  themeActive: any;

  dashBoardPath = DfxRoutes.Dashboard;
  hubLandingPath = DfxRoutes.hubLanding;
  jobsPath = DfxRoutes.Jobs;
  classificationModelPath = DfxRoutes.ClassificationModels;
  classificationBuildModelPath = DfxRoutes.ClassificationBuildModels;
  classificationPublishModelPath = DfxRoutes.ClassificationPublishModels;
  searchenginePath = DfxRoutes.SearchEngine;
  activeSettings: string;

  dataLoader = false;
  apiRespondError = false;
  roles: any;
  success: any;
  loginLoader = false;
  constructor(
    private loginService: LoginService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {

    router.events.subscribe((val) => {
      this.topBar.topSearchkey.nativeElement.value = '';
      this.topBar.setHidden = true;
    });
  }

  setDocTitle(title: string) {
    this.titleService.setTitle(title);
  }

  ngOnInit() {
    // this.getRolesInfo();
    // Page title
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data.title) {
            return child.snapshot.data.title;
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }

}
