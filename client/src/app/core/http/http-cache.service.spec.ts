import { TestBed, inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import { HttpCacheService, HttpCacheEntry } from './http-cache.service';

const cachePersistenceKey = 'httpCache';

describe('HttpCacheService', () => {
  let httpCacheService: HttpCacheService;
  let response: HttpResponse<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheService]
    });

    // Start fresh
    window.sessionStorage.removeItem(cachePersistenceKey);
    window.localStorage.removeItem(cachePersistenceKey);
  });

  beforeEach(inject([HttpCacheService], (_httpCacheService: HttpCacheService) => {
    httpCacheService = _httpCacheService;

    response = new HttpResponse({ body: 'data' });
  }));

  afterEach(() => {
    httpCacheService.cleanCache();
  });

  describe('setCacheData', () => {
    it('should set cache data', () => {
      // Act
      httpCacheService.setCacheData('/test', response);

      // Assert
      expect(httpCacheService.getCacheData('/test')).toEqual(response);
    });

    it('should replace existing data', () => {
      // Arrange
      const newResponse = new HttpResponse({ body: 'new data' });

      // Act
      httpCacheService.setCacheData('/test', response);
      httpCacheService.setCacheData('/test', newResponse);

      // Assert
      expect(httpCacheService.getCacheData('/test')).toEqual(newResponse);
    });

    it('should set cache date correctly', () => {
      // Act
      const date = new Date(123);
      httpCacheService.setCacheData('/test', response, date);
      httpCacheService.setCacheData('/test2', response);

      // Assert
      expect((<HttpCacheEntry>httpCacheService.getHttpCacheEntry('/test')).lastUpdated).toBe(date);
      expect((<HttpCacheEntry>httpCacheService.getHttpCacheEntry('/test2')).lastUpdated).not.toBe(date);
    });
  });

  describe('getCacheData', () => {
    it('should return null if no cache', () => {
      expect(httpCacheService.getCacheData('/test')).toBe(null);
    });

    it('should return cached data if exists', () => {
      // Act
      httpCacheService.setCacheData('/test', response);

      // Assert
      expect(httpCacheService.getCacheData('/test')).toEqual(response);
    });

    it('should return cached data with url parameters if exists', () => {
      // Act
      httpCacheService.setCacheData('/test?pif=paf', response);

      // Assert
      expect(httpCacheService.getCacheData('/test?pif=paf')).toEqual(response);
    });
  });

  describe('getHttpCacheEntry', () => {
    it('should return null if no cache', () => {
      expect(httpCacheService.getHttpCacheEntry('/test')).toBe(null);
    });

    it('should return cached data date  if exists', () => {
      // Arrange
      const date = new Date(123);

      // Act
      httpCacheService.setCacheData('/test', response, date);
      const entry = httpCacheService.getHttpCacheEntry('/test');

      // Assert
      expect(entry).not.toBeNull();
      expect((<HttpCacheEntry>entry).lastUpdated).toEqual(date);
      expect((<HttpCacheEntry>entry).data).toEqual(response);
    });
  });

  describe('clearCacheData', () => {
    it('should clear existing cache data', () => {
      // Set cache
      httpCacheService.setCacheData('/test', response);
      expect(httpCacheService.getCacheData('/test')).toEqual(response);

      // Clear cache
      httpCacheService.clearCache('/test');
      expect(httpCacheService.getCacheData('/test')).toBe(null);
    });

    it('should do nothing if no cache exists', () => {
      expect(httpCacheService.getCacheData('/test')).toBe(null);
      httpCacheService.clearCache('/test2');
      expect(httpCacheService.getCacheData('/test')).toBe(null);
    });
  });

  describe('cleanCache', () => {
    it('should clear all cache if no date is specified', () => {
      // Set cache
      httpCacheService.setCacheData('/test', response);
      httpCacheService.setCacheData('/test2', response);
      expect(httpCacheService.getCacheData('/test')).toBe(response);
      expect(httpCacheService.getCacheData('/test2')).toBe(response);

      // Clean cache
      httpCacheService.cleanCache();
      expect(httpCacheService.getCacheData('/test')).toBe(null);
      expect(httpCacheService.getCacheData('/test2')).toBe(null);
    });

    it('should clear existing since specified date', () => {
      // Set cache
      httpCacheService.setCacheData('/test', response);
      expect(httpCacheService.getCacheData('/test')).toBe(response);

      // Clean cache
      httpCacheService.cleanCache(new Date());
      expect(httpCacheService.getCacheData('/test')).toBe(null);
    });

    it('should not affect cache entries newer than specified date', () => {
      // Set cache
      httpCacheService.setCacheData('/test', response);
      expect(httpCacheService.getCacheData('/test')).toBe(response);

      // Clean cache
      const date = new Date();
      httpCacheService.setCacheData('/test2', response, new Date(date.getTime() + 10));
      httpCacheService.cleanCache(date);

      // Assert
      expect(httpCacheService.getCacheData('/test')).toBe(null);
      expect(httpCacheService.getCacheData('/test2')).toBe(response);
    });
  });

  describe('setPersistence', () => {
    beforeEach(() => {
      httpCacheService.setPersistence();
      httpCacheService.cleanCache = jasmine.createSpy('cleanCache');
    });

    it('should clear previous cache data when persistence value change', () => {
      httpCacheService.setPersistence('local');
      expect(httpCacheService.cleanCache).toHaveBeenCalledWith();
    });

    it('should persist cache to local storage', () => {
      expect(localStorage.getItem(cachePersistenceKey)).toBeNull();

      httpCacheService.setPersistence('local');
      httpCacheService.setCacheData('/test', response);

      expect(localStorage.getItem(cachePersistenceKey)).not.toBeNull();
    });

    it('should persist cache to session storage', () => {
      expect(sessionStorage.getItem(cachePersistenceKey)).toBeNull();

      httpCacheService.setPersistence('session');
      httpCacheService.setCacheData('/test', response);

      expect(sessionStorage.getItem(cachePersistenceKey)).not.toBeNull();
    });
  });
});
