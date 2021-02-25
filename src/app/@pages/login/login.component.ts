import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DfxRoutes, DfxUrl } from 'src/app/routes/name.routes';
import * as Vivus from 'vivus';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { LoginData } from '../../models/login-data';
import { LoginService } from '../../services/login.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.view.html',
})
export class LoginComponent implements OnInit {
  public dfxLoader: boolean;
  login = new LoginData('', '', false);
  errorMsg = '';
  success: any;
  loginLoader = false;
  showSideBar: boolean;
  loghead = true;
  footEnable: boolean;
  source: any;
  interval: NodeJS.Timer;

  @ViewChild('loginSubmit') loginSubmit: ElementRef;
  @ViewChild('loginSubmitButton')
  loginSubmitButton: ElementRef;

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private apiURL = DfxUrl.LoginAPI;

  private storageSub = new Subject<any>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(data: any) {
    this.storageSub.next(data);
  }
  get isLoggedIn() {
    if (!!localStorage.getItem('token')) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }

    return this.loggedIn.asObservable();
    // return !!localStorage.getItem('token')
  }

  // validate(user: LoginData) {
  //   return this.http
  //     .post<any>(this.url, user)
  //     .pipe(catchError(this.errorHandler));
  // }

  constructor(private loginService: LoginService, private router: Router) {
    this.loginService.isLoggedIn.subscribe((data) => {
      if (data) {
        this.router.navigate([DfxRoutes.Dashboard]);
      }
    });
  }

  ngOnInit() {
    $('body').addClass('login');
    // $('.login_section_form').addClass('zoomIn');
    // this.loginSubmitButton.nativeElement.click();

    this.loghead = true;
    this.footEnable = false;

    // if (this.loginService.isLoggedIn) {
    //   this.router.navigate([DfxRoutes.Dashboard]);
    // }
  }

  onSubmit() {
    const els = document.getElementById('bgAnimarion');
    // this.source = fromEvent(this.loginSubmit.nativeElement, 'submit');
    this.loginLoader = true;
    this.loginService.login(this.login.username, this.login.password).subscribe(
      (response: any) => {
        window.location.reload();
        this.success = response;
        console.log(this.success);
        this.success.roles.forEach((ele) => {
          if (ele === 'admin') {
            localStorage.setItem('showadmin', 'true');
            return;
          } else if (ele === 'analyst') {
            localStorage.setItem('showanalyst', 'true');
            return;
          } else if (ele.search('analyst') !== -1) {
            localStorage.setItem('showanalystmenu', 'true');
          }
        });
        localStorage.setItem('roles', this.success.roles);
        localStorage.setItem('username', this.success.username);

        this.loginLoader = false;
        localStorage.setItem('token', 'true');
        this.loginService.loggedIn.next(true);
        this.router.navigateByUrl(DfxRoutes.hubLanding);
      },
      (error) => {
        const myVivus = new Vivus(els, {
          file: 'assets/images/login/bg_error_animated.svg',
        });
        myVivus.play(
          // tslint:disable-next-line: only-arrow-functions
          function () {
            myVivus.reset();
          }
        );

        this.errorMsg = 'Invalid credential';

        $('.alert').addClass('show');
        $('.login_section_form').removeClass('zoomIn');
        $('.login_section_form').addClass('shake');
        setTimeout(() => {
          $('.alert').removeClass('show');
          $('.login_section_form').removeClass('shake');
        }, 3000);
      }
    );
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

  closeAlert() {
    $('.alert').removeClass('show');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}