import { NgModule } from '@angular/core';
import { PrivateInitComponent, PrivateRoutingModule } from './private-routing.module';
import { VisualizationComponent } from '@private/pages/visualization.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';
import { StockService } from '@private/services/stock.service';
import { SharedModule } from '@shared/shared.module';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

import * as Highcharts from 'highcharts';
import { DatePipe, DecimalPipe } from '@angular/common';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/stock')(Highcharts);
const Boost = require('highcharts/modules/boost');

Boost(Highcharts);
@NgModule({
  imports: [
    SharedModule,
    ChartModule,
    PrivateRoutingModule
  ],
  declarations: [
    PrivateInitComponent,
    VisualizationComponent,
    ChartComponent,
    TableComponent
  ],
  providers: [
    StockService,
    DecimalPipe,
    DatePipe,
    {provide: HIGHCHARTS_MODULES, useFactory: (): any => []},
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
  ]
})
export class PrivateModule {
}
