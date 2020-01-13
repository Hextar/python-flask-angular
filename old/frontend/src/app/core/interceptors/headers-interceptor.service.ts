import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {StorageService} from '@app/core/services/storage.service';
import {Injectable, Injector, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '@env/environment';
import {EP_PATHS} from '@app/core/http/api.constants';
import {Logger} from '@app/core/services/logger.service';
import {RefreshTokenService} from '@app/core/services/refresh-token.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {componentDestroyed} from '@w11k/ngx-componentdestroyed';
import {AuthenticationService} from '@public/services/authentication.service';
import {Router} from '@angular/router';
import {TWITTER_CALLBACK_PATH} from '@app/app-routing.constants';

interface BannedUrl {
  method: string;
  url: string;
}

const log = new Logger('HeasersInterceptor');

@Injectable()
export class HeadersInterceptor implements HttpInterceptor, OnDestroy {
  BANNED: BannedUrl[] = [
    {method: 'GET', url: environment.backendUrl + '/' + EP_PATHS.USERS_TWITTER_AUTH_GET}
  ];
  private _refreshTokenService: RefreshTokenService;
  private _storageService: StorageService;
  private _authenticationService: AuthenticationService;
  private _router: Router;
  private _isRefreshing = false;
  private _accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private injector: Injector
  ) {
  }

  ngOnDestroy() {
    this._isRefreshing = false;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Inject alla the services, to be sure they're not null before starting to intercept
    this._injectServices();

    if (request && request.headers && this._urlNotBanned(request.method, request.url)) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
      if (this._isRefreshing && this._getRefreshToken()) {
        request = this._addToken(request, this._getRefreshToken());
      } else if (this._getAccessToken()) {
        request = this._addToken(request, this._getAccessToken());
      }
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && (error.status === 401)) {
        return this._handle401Error(request, next);
      } else if (error instanceof HttpErrorResponse && (error.status === 422)) {
        return this._handle402Error(request, next);
      }
      throw error;
    }));
  }

  private _urlNotBanned(method: string, url: string): boolean {
    const result = this.BANNED.filter((b: BannedUrl) => method === b.method && url === b.url);
    return result ? !result.length : true;
  }

  private _getAccessToken(): string {
    return (this._storageService && this._storageService.credentials && this._storageService.credentials.access_token)
      ? this._storageService.credentials.access_token : '';
  }

  private _getRefreshToken(): string {
    return (this._storageService && this._storageService.credentials && this._storageService.credentials.refresh_token)
      ? this._storageService.credentials.refresh_token : '';
  }

  private _addToken(request: HttpRequest<any>, token: string) {
    return request.clone({setHeaders: {'Authorization': `${token}`}});
  }

  private _handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.endsWith(EP_PATHS.TOKEN_REFRESH_POST)) {
      this._relogin();
    }
    if (!this._isRefreshing) {
      this._isRefreshing = true;
      this._accessTokenSubject.next(null);
      return this._refreshTokenService.refreshToken().pipe(
        switchMap((done: any) => {
          if (done) {
            this._isRefreshing = false;
            this._accessTokenSubject.next(this._getAccessToken());
            return next.handle(this._addToken(request, this._getAccessToken()));
          } else {
            this._relogin();
          }
        })
      );
    } else {

      return this._accessTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this._addToken(request, jwt));
        }));
    }
  }

  private _handle402Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this._isRefreshing && this._getAccessToken()) {
      return next.handle(this._addToken(request, this._getAccessToken()));
    } else if (this._getRefreshToken()) {
      return next.handle(this._addToken(request, this._getRefreshToken()));
    }
    this._relogin();
  }

  private _relogin () {
    const callbackUrl = environment.frontendUrl + TWITTER_CALLBACK_PATH;
    this._authenticationService.relog(callbackUrl)
      .takeUntil(componentDestroyed(this))
      .subscribe((x: any) => x);
  }

  private _injectServices() {
    this._refreshTokenService = this.injector.get<RefreshTokenService>(RefreshTokenService as any);
    this._storageService = this.injector.get<StorageService>(StorageService as any);
    this._authenticationService = this.injector.get<AuthenticationService>(AuthenticationService as any);
    this._router = this.injector.get<Router>(Router as any);
  }

}
