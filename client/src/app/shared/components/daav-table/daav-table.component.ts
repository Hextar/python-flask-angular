import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatPaginator, MatTableDataSource, PageEvent, MatSort, Sort} from '@angular/material';
import { environment } from '@env/environment';
import { noop } from 'rxjs';

export enum DaavTableType {
  LABEL = 'value'
}

export interface DaavTableColumn {
  id: string;
  label?: string;
  title?: string;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  align?: string;
  wrap?: boolean;
  size?: number | string;
  sort?: boolean;
  type: DaavTableType;
}

export interface DaavTableAction {
  class?: string;
  value?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  iconClass?: string;
  icon?: string;
  image?: string;
  disabled?: boolean;
  svgIcon?: string;
  label?: string;
  tooltip?: string;
  callback: string;
  type: DaavTableType;
}

export interface DaavTableContext {
  callback: string;
  index?: number;
  uid?: string;
}

export interface SortedTableData {
  uid: string;
  value: any;
}

@Component({
  selector: 'app-daav-table',
  templateUrl: './daav-table.component.html',
  styleUrls: ['./daav-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaavTableComponent implements OnChanges, AfterViewInit {
  @Input() isLoading = false;
  @Input() data: any[];
  @Input() columns: any[];
  @Input() displayColumns: any[];
  @Input() displayColumnTitle = true;
  @Input() userVirtualScrolling = false;
  @Input() mobileBetterResponsive = true;
  @Input() usePaginator = false;
  @Input() useSort = true;
  @Input() initialSort: Sort;
  @Input() hideLastBorder = true;
  @Input() mainActionEnabled = false;
  @Input() disabled = false;
  @Input() updateOnlyCell = false;
  @Input() totalItems: number;
  @Input() maxActions = 3;
  @Input() paginatorStep = [5, 10, 20];
  @Input() pageIndex: number;
  @Input() pageSize = 10;
  @Input() mainActions: DaavTableAction[] = [];

  @Output() actionCallback: EventEmitter<DaavTableContext> = new EventEmitter<DaavTableContext>(true);
  @Output() paginationChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(true);

  @ViewChild(MatPaginator, {read: true, static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = sort;
      this.dataSource.sort ? this.dataSource.sort.disableClear = true : noop();
    }
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(null);

  cellType = DaavTableType;
  hoverCell = false;

  environment = environment;

  private pageEvent: PageEvent;

  static getSize(value: number, minus?: number): string {
    if (minus) {
      return 'calc(' + value + '% - ' + minus + 'px)';
    } else if (minus === 0 ) {
      return '100';
    } else if (value) {
      return value + 'px';
    }
    return '0';
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // If data has changed load it in the mat-table dataSource
    const dataSourceSC: SimpleChange = changes.data;
    if (dataSourceSC) {
      const dspv = dataSourceSC.previousValue ? dataSourceSC.previousValue : null;
      const dscv = dataSourceSC.currentValue ? dataSourceSC.currentValue : null;
      if (dspv !== dscv) {
        if (!this.dataSource.data) {
          if (this.useSort && this.initialSort) {
            this.sortData(this.initialSort);
          } else {
            this.dataSource.data = dscv;
          }
        } else if (this.dataSource.data !== dscv) {
          this.dataSource.data = dscv;
          if (this.dataSource.sort) {
            this.sortData({active: this.dataSource.sort.active, direction: this.dataSource.sort.direction});
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    if (this.dataSource && this.data) {
      if (this.useSort && this.initialSort) {
        this.sortData(this.initialSort);
      } else {
        this.dataSource.data = this.data;
      }
    }
    if (!this.cd['destroyed']) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  getPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getClass(s: string): string {
    return s ? s : '';
  }

  callActionCallback(callback: string, i: number) {
    const context: DaavTableContext = {callback: callback, uid: this._getElementUid(i)};
    this.actionCallback.emit(context);
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = this.data;
      return;
    }
    this.dataSource.data = this.data.sort((a, b) => {
      const aSortable = this._getSortable(a, sort.active)[0];
      const bSortable = this._getSortable(b, sort.active)[0];
      if (aSortable && bSortable) {
        return this._compare(aSortable, bSortable, sort.direction === 'asc');
      }
      return 0;
    });
  }

  paginatorEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.pageEvent = pageEvent;
      this.pageSize = pageEvent.pageSize;
      this.paginationChange.emit(pageEvent);
    }
  }

  hideHeaderRow(): boolean {
    if (this.displayColumns) {
      return this.displayColumns.filter((d: DaavTableColumn) => d.hidden).length === this.displayColumns.length;
    }
    return false;
  }

  trackByIdx(index: number, item: any) {
    return (item) ? item.uid : index;
  }

  // if page > 1 fix the index adding the page offset
  private _getElementUid(i: number): string {
    return (this.dataSource && this.dataSource.data && this.dataSource.data[i]) ? this.dataSource.data[i].uid : '';
  }

  private _getSortable(x: any, sortKey: string): string | number {
    return (x && x.cols) ? x.cols
      .filter((k: any) => (Object.keys(k)[0] === sortKey))
      .map((k: any) => {
        if (k && k[sortKey]) {
          return (k[sortKey].sort) ? k[sortKey].sort : k[sortKey].value;
        }
        return 0;
      }) : '';
  }

  private _compare(a: string | number, b: string | number, isAsc: boolean) {
    return ((typeof a === 'string' && typeof b === 'string')
      ? (a.toLowerCase() < b.toLowerCase() ? -1 : 1) : (a < b ? -1 : 1)
    ) * (isAsc ? -1 : 1);
  }
}
