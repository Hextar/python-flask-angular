import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DaavTableComponent } from './daav-table.component';
import { SharedModule } from '@app/shared';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ChartModule } from 'angular-highcharts';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, HttpCacheService, StorageService } from '@app/core';

describe('IstellaTableComponent', () => {
  let component: DaavTableComponent;
  let fixture: ComponentFixture<DaavTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ChartModule
      ],
      declarations: [],
      providers: [
        ApiService,
        StorageService,
        HttpCacheService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaavTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
