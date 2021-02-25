import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { DfxUrl } from '../routes/name.routes';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
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
  }

  constructor(
    private http: HttpClient,
    private routes: Router,
  ) {}

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  readRoles(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'roles');
  }

  login(username: any, password: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    // this.credentials: username: password;

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Basic ' + btoa(username + ':' + password)
    //   })
    // };

    return this.http.post<any>(
      DfxUrl.LoginAPI +
      'login?username=' +
      username +
      '&password=' +
      password,
      httpOptions
    );
  }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    return this.http.post<any>(DfxUrl.LoginAPI + 'logout', httpOptions);
    // this.loggedIn.next(false);
    // localStorage.removeItem('token');
    // this.themeService.setTheme('0');
    // localStorage.removeItem('theme');
    this.routes.navigate(['/']);
    $('body').addClass('login');
  }
}
