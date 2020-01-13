import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoreModule, HttpCacheService, StorageService} from '@app/core';

import {ApiService} from './api.service';
import {UserService} from '@private/index';

describe('ApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        ApiService,
        HttpCacheService,
        StorageService,
        UserService,
        HttpClient
      ]
    })
  );

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
