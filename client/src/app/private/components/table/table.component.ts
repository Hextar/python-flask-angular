import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Stock } from '@private/models/stock.model';
import { DaavTableColumn, DaavTableComponent, DaavTableType, SortedTableData } from '@shared/components/daav-table/daav-table.component';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
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

  ngAfterViewInit() {
    if (this.stocks) {
      this._getDataSource();
      // this.dataSource = this.stocks.map((s: Stock) => {
      //   if (s) {
      //     return {
      //       'stock': s.label,
      //       'cpf': s.closing_price_forecast
      //     };
      //   }
      // });
      // console.log(this.dataSource);
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
    const stock = DaavTableComponent.getSize(50);
    const cpf = DaavTableComponent.getSize(50);
    displayColumns = <DaavTableColumn[]>[
      {id: 'stock', label: 'Stock', align: 'left', size: stock, sort: true, type: DaavTableType.LABEL},
      {id: 'cpf', label: 'Close price forecast', size: cpf, sort: true, type: DaavTableType.LABEL},
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
            },
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
