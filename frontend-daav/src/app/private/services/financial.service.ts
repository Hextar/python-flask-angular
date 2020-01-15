import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '@app/core';
import { API_PATHS } from '@app/core/http/api.constants';
import { ApiBaseObject, ApiBaseResponse } from '@app/core/models/api-base.model';
import { catchError, map } from 'rxjs/operators';
import { Stock } from '@app/private/models/stock.model';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NO_STOCK_DATA } from '@private/services/financial.constants';

@Injectable()
export class FinancialService {
  private _apiObject: ApiBaseObject;

  constructor(
    private apiService: ApiService
  ) {
  }

  // GET list of public, future events
  getStocks(stocks: string[], start: string, end: string): Observable<Stock[]> {
    const request = this.apiService.setApiCommonObject();
    request.stocks = stocks;
    request.start = start;
    request.end = end;
    const path = API_PATHS.STOCKS_GET;
    this._apiObject = this.apiService.setApiCallObject(path, request);
    return this.apiService.postApi(this._apiObject).pipe(
      map((response: ApiBaseResponse) => {
        if (response && !!response[0] && response[0].result === 'OK' && !!response[0].data) {
          const stocksData: Stock[] = response[0].data;
          console.log(stocksData);
          return stocksData;
        } else {
          console.error(NO_STOCK_DATA);
          return throwError(NO_STOCK_DATA);
        }
      }),
      catchError(err => {
        console.error(NO_STOCK_DATA);
        return throwError(NO_STOCK_DATA);
      })
    );
  }
}
