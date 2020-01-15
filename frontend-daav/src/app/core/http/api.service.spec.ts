import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, HttpCacheService, StorageService } from '@app/core';

import { ApiService } from './api.service';

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
        HttpClient
      ]
    })
  );

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
