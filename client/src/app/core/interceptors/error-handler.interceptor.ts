import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Adds a setDefault error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (next.handle(request)) {
      return next.handle(request).pipe(catchError(error => this._errorHandler(error)));
    }
  }

  // Customize the setDefault error handler here if needed
  private _errorHandler(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    console.error('Request error', error);
    return throwError(error);
  }
}
