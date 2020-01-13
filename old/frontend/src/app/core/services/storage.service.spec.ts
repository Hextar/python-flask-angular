import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const KEY_PREPEND = 'istella-';
  const USER_INFO_KEY = KEY_PREPEND + 'user-info-session-L2VH9K';
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [StorageService]
    })
  );
  beforeEach(inject([StorageService], (storageService: StorageService) => {
    service = storageService;
  }));

  describe('setRemoveDataInStorage', () => {
    it('should set data in storage', fakeAsync(() => {
      // Act
      service.setDataInStorage(USER_INFO_KEY, 'test', true);
      service.setDataInStorage(USER_INFO_KEY, 'test', false);
      tick();
      expect(sessionStorage.getItem(USER_INFO_KEY)).not.toBeNull();
      expect(localStorage.getItem(USER_INFO_KEY)).not.toBeNull();
    }));

    it('should clear data in storage', fakeAsync(() => {
      // Act
      service.removeDataFromStorage(USER_INFO_KEY);
      tick();
      expect(sessionStorage.getItem(USER_INFO_KEY)).toBeNull();
      expect(localStorage.getItem(USER_INFO_KEY)).toBeNull();
    }));
  });

  describe('getDataFromStorage', () => {
    it('should get data from storage', fakeAsync(() => {
      // Act
      service.setDataInStorage(USER_INFO_KEY, 'test', true);
      tick();
      const request = service.getDataFromStorage(USER_INFO_KEY);
      tick();
      expect(request).not.toBeNull();
    }));

    it('should return error after clearing storage', fakeAsync(() => {
      // Act
      service.removeDataFromStorage(USER_INFO_KEY);
      tick();
      const request = service.getDataFromStorage(USER_INFO_KEY);
      tick();
      expect(request).toBeNull();
    }));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
