import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/catch';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '@app/core';
import {API_PATHS} from '@app/core/http/api.constants';
import {ApiBaseObject} from '@app/core/models/api-base.model';
import {catchError, map} from 'rxjs/operators';
import {Stock} from '@app/private/models/stock.model';
import {throwError} from 'rxjs/internal/observable/throwError';

@Injectable()
export class FinancialService {
  private _apiObject: ApiBaseObject;

  constructor(
    private apiService: ApiService
  ) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getStocks(): Observable<Stock[]> {
    const request = this.apiService.setApiCommonObject();
    const path = API_PATHS.STOCKS_GET;
    this._apiObject = this.apiService.setApiCallObject(path, request);
    return this.apiService.getApi(this._apiObject).pipe(
      map((stocks: any) => {
        if (stocks) {
          return stocks;
        }
      }),
      catchError(err => {
        return throwError('ERRORE');
      })
    );
  }
}
