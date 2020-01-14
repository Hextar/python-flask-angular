import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {RouteReusableStrategy} from './route-reusable-strategy';
import {StorageService} from '@app/core/services/storage.service';
import {I18nService} from './services/i18n.service';
import {HttpService} from './http/http.service';
import {HttpCacheService} from './http/http-cache.service';
import {ApiService} from './http/api.service';
import {ApiPrefixInterceptor} from './interceptors/api-prefix.interceptor';
import {ErrorHandlerInterceptor} from './interceptors/error-handler.interceptor';
import {CacheInterceptor} from './interceptors/cache.interceptor';
import {HeadersInterceptor} from '@app/core/interceptors/headers-interceptor.service';
import {RefreshTokenService} from '@app/core/services/refresh-token.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    RouterModule
  ],
  providers: [
    I18nService,
    StorageService,
    HttpCacheService,
    RefreshTokenService,
    ApiService,
    HeadersInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    ApiPrefixInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
