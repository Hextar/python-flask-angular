import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '@private/services/stock.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Stock } from '@private/models/stock.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  isLoading = false;
  stock$ = new BehaviorSubject<Stock[]>(null as Stock[]);
  breakPointSubscription: Subscription;
  stocoSubscription: Subscription;
  mobile = false;

  constructor(
    private stockService: StockService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakPointSubscription = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((breakpoint: any) => {
        this.mobile = breakpoint.matches;
      });
  }

  ngOnInit() {
    // this.isLoading = true;
    const stocksToAnalyse = ['CROP', 'UGA', 'NDAQ'];
    const start = '2015-1-1';
    const end = '2020-1-1';
    this.isLoading = true;
    this.stocoSubscription = this.stockService.getStocks(stocksToAnalyse, start, end)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.stock$.next(response);
      });
  }

  ngOnDestroy() {
    this.breakPointSubscription.unsubscribe();
    this.stocoSubscription.unsubscribe();
  }

}
