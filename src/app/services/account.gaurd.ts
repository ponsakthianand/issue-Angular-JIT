import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
@Injectable()
export class AccountGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log(this.usernameExist());
    return this.usernameExist();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return this.usernameExist();
  }

  canLoad(route: Route): boolean | Promise<boolean> {
    return this.usernameExist();
  }

  roleExist() {
    return !!localStorage.getItem('roles');
  }
  usernameExist() {
    return !!localStorage.getItem('username');
  }
}
