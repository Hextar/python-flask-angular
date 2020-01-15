import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationComponent } from './visualization.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { ChartComponent } from '@private/components/chart/chart.component';
import { TableComponent } from '@private/components/table/table.component';
import { FinancialService } from '@private/services/financial.service';
import { ApiService, HttpService, StorageService } from '@app/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('VisualizationComponent', () => {
  let component: VisualizationComponent;
  let fixture: ComponentFixture<VisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        MaterialModule,
        HttpClientModule
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
        FinancialService
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