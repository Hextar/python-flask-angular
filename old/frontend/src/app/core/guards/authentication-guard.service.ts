import {Injectable} from '@angular/core';
import {Router, CanActivate, CanLoad} from '@angular/router';
import {AuthenticationService} from '@public/services/authentication.service';
import {HOME_PATH, LOGIN_PATH} from '@app/app-routing.constants';

@Injectable()
export class IsAuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate() {
    return (this.authService.isAuthenticated()) ? true :  this.router.parseUrl(LOGIN_PATH);
  }
}

@Injectable()
export class IsNotAuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate() {
    return (this.authService.isAuthenticated()) ? this.router.parseUrl(HOME_PATH) : true;
  }
}
