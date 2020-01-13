import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StorageService} from '@app/core/services/storage.service';
import {catchError, map, retryWhen} from 'rxjs/operators';
import {ApiBaseObject} from '@app/core/models/api-base.model';
import {noop, Observable, of} from 'rxjs';
import {_throw} from 'rxjs/observable/throw';
import {timer} from 'rxjs/observable/timer';
import {mergeMap, finalize} from 'rxjs/operators';
import {HttpCacheService} from '@app/core/http/http-cache.service';
import {environment} from '@env/environment';
import {Logger} from '@app/core/services/logger.service';
import {USER_ID_REPLACE, MONITORING_ID_REPLACE, SENTIMENT_PAGE_REPLACE} from '@app/core/http/api.constants';
import {StorageCredentials} from '@app/core/services/storage.constants';

const log = new Logger('ApiService');

const genericRetryStrategy = (
  {
    maxRetryAttempts = 3,
    scalingDuration = 1000,
    excludedStatusCodes = []
  }: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return _throw(error);
      }
      log.warn(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => log.warn('Stop retrying!'))
  );
};

/**
 * @desc this class is used to get, post, update api data.
 */
@Injectable()
export class ApiService {
  private SALT = '';
  private CREDENTIALS_KEY = '';

  constructor(
    private http: HttpClient,
    private cache: HttpCacheService,
    private storageService: StorageService
  ) {
    this.SALT = this.storageService.salt;
    this.CREDENTIALS_KEY = this.storageService.credentialsKey;
  }

  /**
   * @method getApi()
   * @desc getApi is common method for get API
   * @param endpoint :string - end point url of api calling.
   * @param tokenRequiredFlag :boolean - define token is mandatory or not.
   * @param returnWithoutMap :boolean - a boolean to return with or without map.
   */
  getApi<T>(apiObject: ApiBaseObject): any {
    let params: HttpParams = new HttpParams();
    Object.keys(apiObject.apiData).forEach((item: any) => params = params.set(item, apiObject.apiData[item]));
    return this.http.get<T>(`${apiObject.endpoint}`, {params: params}).pipe(
      map(res => res),
      retryWhen(
        genericRetryStrategy({
          scalingDuration: 600,
          excludedStatusCodes: [400, 401, 422]
        })
      ),
      catchError(error => of({response: {error: error}}))
    );
  }

  /**
   * @method postApi()
   * @desc postApi is common method for post API
   * @param endpoint :string - end point url of api calling.
   * @param data :json - request payload of api.
   * @param tokenRequiredFlag :boolean - define token is mandatory or not.
   */
  postApi<T>(apiObject: ApiBaseObject): any {
    return this.http.post<T>(`${apiObject.endpoint}`, apiObject.apiData).pipe(
      map(res => res),
      retryWhen(
        genericRetryStrategy({
          scalingDuration: 2000,
          excludedStatusCodes: [400, 401, 422]
        })
      ),
      catchError(error => of({response: {error: error}}))
    );
  }

  /**
   * @method putApi()
   * @desc putApi is common method for put API
   * @param endpoint :string - end point url of api calling.
   * @param data :json - request payload of api.
   * @param tokenRequiredFlag :boolean - define token is mandatory or not.
   */
  putApi<T>(apiObject: ApiBaseObject): any {
    return this.http.put<T>(`${apiObject.endpoint}`, apiObject.apiData).pipe(
      map(res => res),
      retryWhen(
        genericRetryStrategy({
          scalingDuration: 2000,
          excludedStatusCodes: [400, 401, 422]
        })
      ),
      catchError(error => of({response: {error: error}}))
    );
  }

  /**
   * @method deleteApi()
   * @desc deleteApi is common method for put API
   * @param endpoint :string - end point url of api calling.
   * @param data :json - request payload of api.
   * @param tokenRequiredFlag :boolean - define token is mandatory or not.
   */
  deleteApi<T>(apiObject: ApiBaseObject): any {
    let params: HttpParams = new HttpParams();
    Object.keys(apiObject.apiData).forEach((item: any) => params = params.set(item, apiObject.apiData[item]));
    return this.http.delete<T>(`${apiObject.endpoint}`, {params: params}).pipe(
      map(res => res),
      retryWhen(
        genericRetryStrategy({
          scalingDuration: 2000,
          excludedStatusCodes: [400, 401, 422]
        })
      ),
      catchError(error => of({response: {error: error}}))
    );
  }

  /**
   * @method setApiCommonObject()
   * @desc method to set api common request object.
   */
  setApiCommonObject(company_id: boolean = false, user_id: boolean = false, username: boolean = false): any {
    const commonObject = {} as any;
    const credentials: StorageCredentials = this.storageService.credentials;
    if (credentials) {
      company_id ? commonObject.company_id = credentials.company_id : noop();
      user_id ? commonObject.user_id = credentials.user_id : noop();
      username ? commonObject.username = credentials.username : noop();
    }
    return commonObject;
  }

  /**
   * @method setApiCallObject()
   * @desc method to set api base object data.
   * @param endpoint api endpoint url.
   * @param apiData api data to post.
   * @param tokenRequiredFlag api token required for the api call.
   * @param alertHide alert hide functionality.
   */
  setApiCallObject(
    endpoint: string,
    apiData: object,
    tokenRequiredFlag: boolean = true,
    forceReload: boolean = false,
    alertHide: boolean = false
  ): ApiBaseObject {
    return {
      endpoint: endpoint,
      apiData: apiData,
      tokenRequiredFlag: tokenRequiredFlag,
      forceReload: forceReload,
      alertHide: alertHide
    };
  }

  getUserPath(url: string, user_id?: string): string {
    return url.replace(
      USER_ID_REPLACE,
      user_id ? user_id : this.storageService.credentials ? this.storageService.credentials.user_id : null
    );
  }

  getMonitoringPath(url: string, id: string): string {
    return url.replace(MONITORING_ID_REPLACE, id);
  }

  getSentimentPath(url: string, id: string, page: number): string {
    return url.replace(MONITORING_ID_REPLACE, id).replace(SENTIMENT_PAGE_REPLACE, page + '');
  }

  getSentimentStatsPath(url: string, id: string): string {
    return url.replace(MONITORING_ID_REPLACE, id);
  }

  clearApiFromCache(url: string) {
    const request = this.setApiCommonObject();
    let params = '?';
    if (request) {
      Object.keys(request).forEach((item: any) => params = params + item + '=' + request[item] + '&');
      params = params.slice(0, -1);
    }
    this.cache.clearCache(environment.backendUrl + '/' + url + params);
  }
}
