import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '@private/services/stock.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Stock } from '@private/models/stock.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { STOCK_COLOR_LIST } from '@private/components/filters/filters.constants';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  isLoading = false;
  stock$ = new BehaviorSubject<Stock[]>(null as Stock[]);
  breakPointSubscription: Subscription;
  stocksSubscription: Subscription;
  mobile = false;
  stocksToAnalyse = ['CORN', 'UGA', 'NDAQ'];
  start = '2015-1-2';
  end = '2020-1-2';
  stocksColors = STOCK_COLOR_LIST;

  constructor(
    private stockService: StockService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Listens for window size changes
    this.breakPointSubscription = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((breakpoint: any) => {
        this.mobile = breakpoint.matches;
      });
  }

  ngOnInit() {
    this._loadStocks();
  }

  ngOnDestroy() {
    this.breakPointSubscription.unsubscribe();
    this.stocksSubscription.unsubscribe();
  }

  reloadStocks() {
    this._loadStocks();
  }

  private _loadStocks() {
    this.isLoading = true;
    this.stocksSubscription = this.stockService.getStocks(this.stocksToAnalyse, this.start, this.end)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.stock$.next(response);
      });
  }

}
