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
import {Logger} from '@app/core/services/logger.service';
import {RefreshTokenService} from '@app/core/services/refresh-token.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {Router} from '@angular/router';

interface BannedUrl {
  method: string;
  url: string;
}

const log = new Logger('HeasersInterceptor');

@Injectable()
export class HeadersInterceptor implements HttpInterceptor, OnDestroy {
  // /*BANNED: BannedUrl[] = [
  //   {method: 'BANNED_URL_METHOD', url: environment.backendUrl + '/' + BANNED_URL_ENDPOINT}
  // ];*/
  BANNED: BannedUrl[] = [];
  private _refreshTokenService: RefreshTokenService;
  private _storageService: StorageService;
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
    if (!this._isRefreshing) {
      this._isRefreshing = true;
      this._accessTokenSubject.next(null);
      return this._refreshTokenService.refreshToken().pipe(
        switchMap((done: any) => {
          if (done) {
            this._isRefreshing = false;
            this._accessTokenSubject.next(this._getAccessToken());
            return next.handle(this._addToken(request, this._getAccessToken()));
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
  }

  private _injectServices() {
    this._refreshTokenService = this.injector.get<RefreshTokenService>(RefreshTokenService as any);
    this._storageService = this.injector.get<StorageService>(StorageService as any);
    this._router = this.injector.get<Router>(Router as any);
  }

}
