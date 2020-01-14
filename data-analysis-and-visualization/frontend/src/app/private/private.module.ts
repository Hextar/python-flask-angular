import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateInitComponent, PrivateRoutingModule } from './private-routing.module';
import { VisualizationComponent } from '@private/pages/visualization.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';
import { FinancialService } from '@private/services/financial.service';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';


@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [
    PrivateInitComponent,
    VisualizationComponent,
    ChartComponent,
    TableComponent
  ],
  providers: [
    FinancialService
  ]
})
export class PrivateModule {
}
