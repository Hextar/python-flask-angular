import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Stock } from '@private/models/stock.model';
import { DaavTableColumn, DaavTableComponent, DaavTableType, SortedTableData } from '@shared/components/daav-table/daav-table.component';
import { Sort } from '@angular/material';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
  @Input() headingTitle: string;
  @Input() bottomDescription: string;
  @Input() stocks: Stock[] = [];
  @Input() end: string;
  @Input() mobile = false;
  @Input() stocksColors: string[];
  @Input() displayColumns: any[];
  @Input() displayColumnTitle = true;
  @Input() mobileBetterResponsive = true;
  @Input() useSort = true;
  @Input() disabled = false;
  @Input() format = '1.0';

  data = [];
  initialSort: Sort = {active: 'stock', direction: 'asc'};
  stockWithId: SortedTableData[] = [];
  nextDay: Moment;
  accuracy = 0.9939904210784928;

  constructor(
    private cd: ChangeDetectorRef,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const stocks: SimpleChange = changes.stocks;
    if (stocks) {
      const dpv = stocks.previousValue;
      const dcv = stocks.currentValue;
      if (dcv && dpv !== dcv) {
        this.stockWithId = dcv.map((x: any, index: number) => {
          return {uid: 'UID-' + index, value: x};
        });
        this._getDataSource();
        this._nextDay();
      }
    }
  }

  private _nextDay() {
    if (this.end) {
      this.nextDay = moment(this.end).add(1, 'day');
    }
  }

  private _getDataSource() {
    if (this.stockWithId) {
      this.displayColumns = this._getDisplayColmuns();
      this.data = this._getRows();
      this._detectChanges();
    }
  }

  //// ISTELLA TABLE INIT
  private _getDisplayColmuns(): DaavTableColumn[] {
    let displayColumns: DaavTableColumn[];
    const colorIconSize = DaavTableComponent.getSize(32);
    const stockSize = DaavTableComponent.getSize(50, 48);
    const cpfSize = DaavTableComponent.getSize(50, 48);
    displayColumns = <DaavTableColumn[]>[
      {id: 'colorIcon', label: '', size: colorIconSize, type: DaavTableType.COLOR_ICON},
      {id: 'stock', label: 'Stock', align: 'left', size: stockSize, sort: true, type: DaavTableType.LABEL},
      {id: 'cpf', label: 'Close price forecast', align: 'left', size: cpfSize, sort: true, type: DaavTableType.LABEL},
    ];
    return displayColumns;
  }

  private _getRows(): any[] {
    const rows: any[] = this.stockWithId.map((s: SortedTableData, idx: number) => {
      const x = s.value;
      return {
        uid: s.uid,
        cols: [
          {
            [this.displayColumns[0].id]: {
              value: this.stocksColors[idx]
            }
          },
          {
            [this.displayColumns[1].id]: {
              value: x.label,
              sort: x.label,
              align: 'left'
            }
          },
          {
            [this.displayColumns[2].id]: {
              value: '$' + this.decimalPipe.transform(x.forecast.closing_price, this.format),
              sort: x.forecast.closing_price,
              align: 'left'
            }
          }
        ]
      };
    });
    return rows;
  }

  private _detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

}
