import {Injectable, Injector, OnDestroy} from '@angular/core';
import {ApiService} from '@app/core/http/api.service';
import {API_PATHS} from '@app/core/http/api.constants';
import {StorageService} from '@app/core/services/storage.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiBaseObject} from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService implements OnDestroy {
  private _apiService: ApiService;
  private _storageService: StorageService;
  private apiObject: ApiBaseObject;
  private _cacheCredentials = true;

  constructor(
    private injector: Injector
  ) {
    this._apiService = injector.get<ApiService>(ApiService as any);
    this._storageService = injector.get<StorageService>(StorageService as any);
  }

  ngOnDestroy() {
    //
  }

  refreshToken(): Observable<boolean> {
    this.apiObject = this._apiService.setApiCallObject(API_PATHS.TOKEN_REFRESH_POST, {});
    return this._apiService.postApi(this.apiObject).pipe(
      map((response: any) => {
        if (!response.access_token || !response.refresh_token) {
          return false;
        } else if (response && this._cacheCredentials) {
          const credentials = this._storageService.credentials ? this._storageService.credentials : {};
          credentials.access_token = response.access_token;
          credentials.refresh_token = response.refresh_token;
          this._storageService.setCredentials(credentials, true);
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
