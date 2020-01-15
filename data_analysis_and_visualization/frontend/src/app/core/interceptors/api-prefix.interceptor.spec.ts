import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http/http.service';
import { environment } from '@env/environment';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { ApiService, StorageService } from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApiPrefixInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ApiPrefixInterceptor,
        ErrorHandlerInterceptor,
        ApiService,
        StorageService,
        {
          provide: HttpClient,
          useClass: HttpService
        }
      ]
    });
  });

  beforeEach(inject([HttpClient, HttpTestingController], (_http: HttpClient, _httpMock: HttpTestingController) => {
    http = _http;
    httpMock = _httpMock;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should prepend environment.backendUrl to the request url', fakeAsync(() => {
    // Act
    http.get('toto').subscribe();
    tick();
    // Assert
    httpMock.expectOne({ url: environment.backendUrl + '/toto' });
  }));

  it('should not prepend environment.backendUrl to request url', () => {
    // Act
    http.get('hTtPs://domain.com/toto').subscribe();

    // Assert
    httpMock.expectOne({ url: 'hTtPs://domain.com/toto' });
  });
});
