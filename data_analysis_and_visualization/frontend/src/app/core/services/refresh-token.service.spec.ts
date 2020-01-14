import { TestBed } from '@angular/core/testing';

import { RefreshTokenService } from './refresh-token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, StorageService } from '@app/core';

describe('RefreshTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ApiService,
        StorageService
      ]
    });
  });

  it('should be created', () => {
    const service: RefreshTokenService = TestBed.get(RefreshTokenService);
    expect(service).toBeTruthy();
  });
});
