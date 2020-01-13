import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '@env/environment';

/**
 * Prefixes all requests with `environment.backendUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url) && /.(jpg|jpeg|png|svg)$/i.test(request.url)) {
      request = request.clone({ url: 'assets/' + request.url });
    } else if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.backendUrl + '/' + request.url });
    }
    return next.handle(request);
  }

}
