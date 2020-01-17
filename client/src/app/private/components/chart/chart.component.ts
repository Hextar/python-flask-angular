import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import {StockChart} from 'angular-highcharts';
import {
  PlotOptions,
  PointOptionsObject,
  RangeSelectorButtonsEventsOptions,
  RangeSelectorButtonTypeValue,
  SeriesAreaOptions
} from 'highcharts';
import { ViewChildren } from '@angular/core';
import { ChartLangEn } from '@app/app.constants';
import { Stock, StockData } from '@private/models/stock.model';
import { noop } from 'rxjs';
import * as moment from 'moment';

interface RangeSelectorButtons {
  count?: number;
  dataGrouping?: any;
  events?: RangeSelectorButtonsEventsOptions;
  offsetMax?: number;
  offsetMin?: number;
  preserveDataGrouping?: boolean;
  text?: string;
  type?: RangeSelectorButtonTypeValue;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnDestroy {
  @ViewChildren('highchartsContainer') highchartsQuery: QueryList<ElementRef>;

  @Input() headingTitle: string;
  @Input() headingDescription: string;
  @Input() yTitle: string;
  @Input() xTitle: string;
  @Input() labelHover: string;
  @Input() stocks: Stock[] = [];
  @Input() mobile = false;

  EXPORTING = true;
  THRESHOLD = 500000;
  MOBILE_THRESHOLD = 50000;
  stockChart: StockChart;

  series: SeriesAreaOptions[];
  chartHeight = 380;
  mobileChartHeight = 240;

  plotOptions: PlotOptions = {
    series: {
      connectNulls: true,
      showInNavigator: true
    },
    area: {
      marker: {radius: 2},
      lineWidth: 1,
      states: {hover: {lineWidth: 1}},
      threshold: null,
    }
  };

  private _chartContainer: ElementRef;

  constructor(
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const stocks = changes.stocks;
    if (stocks) {
      if (stocks && stocks.isFirstChange() &&  stocks.currentValue) {
        this._initPlotOptions();
        this._getSeries();
        this._createChart();
      } else if (stocks.currentValue !== stocks.previousValue) {
        if (this.stocks && (this.stocks.length > (this.mobile ? this.MOBILE_THRESHOLD : this.THRESHOLD))) {
          this.plotOptions.area.turboThreshold = this.stocks.length;
        }
        this._getSeries();
        this._updateChart();
      }
    }
    this._detectChanges();
  }

  ngOnDestroy() {
    if (this.stockChart && this.stockChart.ref) {
      this.stockChart.ref.destroy();
      this.stockChart = null;
    }
  }

  getChartHeight(): number {
    return this.mobile ? this.mobileChartHeight : this.chartHeight;
  }

  private _initPlotOptions() {
    const animation = !this.mobile;
    this.plotOptions.series.turboThreshold = this.mobile ? this.MOBILE_THRESHOLD : this.THRESHOLD;
    // series
    this.plotOptions.series.shadow = false;
    this.plotOptions.series.animation = animation;
    this.plotOptions.series.enableMouseTracking = animation;
    this.plotOptions.series.stickyTracking = animation;
    this.plotOptions.series.dataLabels = {style: {textShadow: animation}};
    // area
    this.plotOptions.area.fillOpacity = 0;
    this.plotOptions.area.lineWidth = 2;
    this.plotOptions.area.shadow = false;
    this.plotOptions.area.animation = animation;
    this.plotOptions.area.enableMouseTracking = animation;
    this.plotOptions.area.stickyTracking = animation;
    this.plotOptions.area.dataLabels = {style: {textShadow: animation}};
  }

  private _getSeries() {
    const timezoneOffset = moment().utcOffset();
    if (this.stocks) {
      this.series = <SeriesAreaOptions[]>this.stocks.map((s: Stock) => {
        return <SeriesAreaOptions>{
          type: 'area',
          name: s.label,
          data: s.stock_data.map((point: any) => {
            return <PointOptionsObject>[
              Number(point.timestamp),
              point.value
            ];
          })
        };
      });
    }
    return this.series;
  }

  private _getTimestamps(): number[] {
    if (this.series) {
      return this.stocks[0].stock_data.map((p: StockData) => {
        return p.timestamp;
      });
    } else {
      return [];
    }
  }

  private _getFirstDate(): number {
    return this._getTimestamps()[0];
  }

  private _createChart() {
    const _this = this;
    if (this.series) {
      this.stockChart = new StockChart({
        chart: {
          height: this.getChartHeight(),
          zoomType: 'x',
          renderTo: this._chartContainer ? this._chartContainer.nativeElement : '0',
          animation: !this.mobile,
          reflow: true,
          events: {
            load: function () { console.warn(_this.plotOptions); }
          },
        },
        title: {
          text: null
        },
        xAxis: {
          min: this._getFirstDate(),
          type: 'datetime',
          title: {
            text: this.xTitle ? this.xTitle : ''
          },
          labels: {
            format: '{value:%d/%m/%y %H:%M}',
            autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
          },
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b %y',
            year: '%Y'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: this.yTitle ? this.yTitle : ''
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
          valueDecimals: 2,
          split: true
        },
        legend: {enabled: false},
        credits: {enabled: false},
        plotOptions: this.plotOptions,
        series: this.series,
        time: {useUTC: false},
        rangeSelector: {
          enabled: true,
          buttons: this._getRangeSelectorButtons(),
          inputEnabled: true,
          selected: 0
        },
        navigator: {
          enabled: true,
        },
        scrollbar: {
          barBackgroundColor: '#e9e9e9',
          barBorderRadius: 0,
          barBorderWidth: 0,
          buttonBackgroundColor: '#e1e1e1',
          buttonBorderWidth: 0,
          buttonBorderRadius: 0,
          trackBackgroundColor: 'none',
          trackBorderWidth: 0,
          trackBorderRadius: 4,
          trackBorderColor: '#e1e1e1'
        },
        exporting: {
          enabled: this.EXPORTING
        },
        lang: ChartLangEn
      });
    }
  }

  private _updateChart() {
    if (this.stockChart && this.stockChart.ref) {
      this.stockChart.ref.xAxis[0].min = this._getFirstDate();

      this.series.map((s: SeriesAreaOptions, idx: number) => {
        this.stockChart.ref.series[idx].setData(s.data, false);
      });
      this.stockChart.ref.options.rangeSelector.buttons = this._getRangeSelectorButtons();
      this.stockChart.ref.redraw(true);
    }
  }

  private _getRangeSelectorButtons(): RangeSelectorButtons[] {
    let buttons: RangeSelectorButtons[] = [
      {type: 'all', text: 'All'}
    ];
    const timestamps = this._getTimestamps();
    if (timestamps && timestamps.length) {
      const diff = timestamps[timestamps.length - 1] - timestamps[0];
      diff > 43200 ? buttons = [...[<RangeSelectorButtons>{count: 1, type: 'month', text: '1M'}], ...buttons] : noop();
      diff > 129600 ? buttons = [...[<RangeSelectorButtons>{count: 3, type: 'month', text: '3M'}], ...buttons] : noop();
      diff > 259200 ? buttons = [...[<RangeSelectorButtons>{count: 6, type: 'month', text: '6M'}], ...buttons] : noop();
      diff > 518400 ? buttons = [...[<RangeSelectorButtons>{count: 1, type: 'year', text: '1Y'}], ...buttons] : noop();
    }
    return buttons;
  }

  private _detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
