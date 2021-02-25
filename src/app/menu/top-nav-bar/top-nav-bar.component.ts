import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './top-nav-bar.component.html',
})
export class TopNavBarComponent implements OnInit, AfterViewInit {
  @ViewChild('searchEngine') searchEngine;
  @ViewChild('topSearchkey') topSearchkey: ElementRef;
  @ViewChild('topSearchAll') topSearchAll: ElementRef;
  source: Subscription;
  sourceAll: Subscription;
  setHidden = true;
  loginPageVisible: boolean;
  setHiddensec = true;
  userName: any;
  config: any;
  hubLandingPath = DfxRoutes.hubLanding;

  name: string;
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private routes: Router
  ) {
    router.events.subscribe((val) => {
      this.removeFromDom();
    });
  }

  closeSearch() {
    this.topSearchkey.nativeElement.value = '';
    this.searchEngine.secSearchkey.nativeElement.value = '';
    this.setHidden = true;
    this.setHiddensec = false;
  }

  removeFromDom() {
    this.setHiddensec = false;
  }

  setFocus() {
    this.setHiddensec = true;
  }

  searchAll() {
    this.setHidden = false;
    this.searchEngine.triggerSearch('searchAll');
  }

  toggleClicked(event: MouseEvent) {
    // toggle small or large menu
    if ($('body').hasClass('nav-md')) {
      $('#sidebar-menu').find('li.active ul').hide();
      $('#sidebar-menu')
        .find('li.active')
        .addClass('active-sm')
        .removeClass('active');
    } else {
      $('#sidebar-menu').find('li.active-sm ul').show();
      $('#sidebar-menu')
        .find('li.active-sm')
        .addClass('active')
        .removeClass('active-sm');
    }
    $('body').toggleClass('nav-md nav-sm');
  }
  ngOnInit() {
    // this.userName = localStorage.getItem('roles').split(',')[0];
    // console.log(this.userName);
  }

  ngAfterViewInit() {
    this.searchEngine.secSearchkey.nativeElement = this.topSearchkey.nativeElement;
    this.source = fromEvent(this.topSearchkey.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        map((event: Event) => (event.target as HTMLInputElement).value),
        switchMap((value: any) => {
          console.log(this.searchEngine);

          this.searchEngine.secSearchkey.nativeElement.value = value;
          this.searchEngine.triggerSearch(value);
          this.setHidden = value ? false : true;
          return [];
        })
      )
      .subscribe(
        (response: any) => {},
        (error) => {}
      );
  }

  logout() {
    this.loginService.logout();
    localStorage.removeItem('roles');
    localStorage.clear();
    this.routes.navigate(['/']);
    this.loginPageVisible = true;
    $('body').addClass('login');
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

  get usrname() {
    return localStorage.getItem('username');
  }
}
