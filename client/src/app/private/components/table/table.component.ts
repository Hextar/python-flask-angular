import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Stock } from '@private/models/stock.model';
import { DaavTableColumn, DaavTableComponent, DaavTableType, SortedTableData } from '@shared/components/daav-table/daav-table.component';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
  @Input() headingTitle: string;
  @Input() bottomDescription: string;
  @Input() stocks: Stock[] = [];
  @Input() mobile = false;
  @Input() displayColumns: any[];
  @Input() displayColumnTitle = true;
  @Input() mobileBetterResponsive = true;
  @Input() useSort = true;
  @Input() disabled = false;

  data = [];
  initialSort: Sort = {active: 'stock', direction: 'asc'};
  stockWithId: SortedTableData[] = [];

  constructor(
    private cd: ChangeDetectorRef
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
      }
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
    const stockSize = DaavTableComponent.getSize(50, 16);
    const cpfSize = DaavTableComponent.getSize(50, 16);
    displayColumns = <DaavTableColumn[]>[
      {id: 'stock', label: 'Stock', align: 'left', size: stockSize, sort: true, type: DaavTableType.LABEL},
      {id: 'cpf', label: 'Close price forecast', align: 'left', size: cpfSize, sort: true, type: DaavTableType.LABEL},
    ];
    return displayColumns;
  }

  private _getRows(): any[] {
    const rows: any[] = this.stockWithId.map((s: SortedTableData) => {
      const x = s.value;
      return {
        uid: s.uid,
        cols: [
            {
              [this.displayColumns[0].id]: {
                value: x.label,
                sort: x.label,
                align: 'left'
              }
            },
            {
              [this.displayColumns[1].id]: {
                value: x.closing_price_forecast,
                sort: x.closing_price_forecast,
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
