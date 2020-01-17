import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizationComponent } from './visualization.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { ChartComponent } from '@private/components/chart/chart.component';
import { TableComponent } from '@private/components/table/table.component';
import { StockService } from '@private/services/stock.service';
import { ApiService, StorageService } from '@app/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

describe('VisualizationComponent', () => {
  let component: VisualizationComponent;
  let fixture: ComponentFixture<VisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        ChartModule
      ],
      declarations: [
        VisualizationComponent,
        ChartComponent,
        TableComponent
      ],
      providers: [
        ApiService,
        HttpClient,
        StorageService,
        StockService,
        {provide: HIGHCHARTS_MODULES, useFactory: (): any => []},
        {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
