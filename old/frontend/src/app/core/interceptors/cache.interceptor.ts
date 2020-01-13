import { Injectable, OnDestroy } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

import { HttpCacheService } from '../http/http-cache.service';
import { componentDestroyed } from '@w11k/ngx-componentdestroyed';

/**
 * Caches HTTP requests.
 * Use ExtendedHttpClient fluent API to configure caching for each request.
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor, OnDestroy {
  private forceUpdate = false;

  constructor(
    private httpCacheService: HttpCacheService
  ) {}

  ngOnDestroy() {
    // Empty because '.takeUntil(componentDestroyed(this))' is used
  }

  /**
   * Configures interceptor options
   * @param {{update: boolean}} options If update option is enabled, forces request to be made and updates cache entry.
   * @return {CacheInterceptor} The configured instance.
   */
  configure(options?: { update?: boolean } | null): CacheInterceptor {
    const instance = new CacheInterceptor(this.httpCacheService);
    if (options && options.update) {
      if (instance) {
        instance.forceUpdate = true;
      }
    }
    return instance;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    return new Observable((subscriber: Subscriber<HttpEvent<any>>) => {
      const cachedData = this.forceUpdate ? null : this.httpCacheService.getCacheData(request.urlWithParams);
      if (cachedData !== null) {
        // Create new response to avoid side-effects
        subscriber.next(new HttpResponse(cachedData as Object));
        subscriber.complete();
      } else {
        if (next.handle(request)) {
          next.handle(request)
            .takeUntil(componentDestroyed(this))
            .subscribe(event => {
              if (event) {
                if (event instanceof HttpResponse) {
                  this.httpCacheService.setCacheData(request.urlWithParams, event);
                }
                subscriber.next(event);
              }
              },
              error => subscriber.error(error),
              () => subscriber.complete()
            );
        }
      }
    });
  }
}
