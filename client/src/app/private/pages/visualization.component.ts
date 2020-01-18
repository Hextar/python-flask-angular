import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from '@private/services/stock.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Stock } from '@private/models/stock.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';


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

  stocksToAnalyse: string[];
  stocksColors: string[];
  start: string;
  end: string;

  constructor(
    private stockService: StockService,
    private breakpointObserver: BreakpointObserver,
    private datePipe: DatePipe
  ) {
    this.breakPointSubscription = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((breakpoint: any) => {
        this.mobile = breakpoint.matches;
      });
  }

  ngOnInit() {
    // this.isLoading = true;
    this.stocksToAnalyse = ['CROP', 'UGA', 'NDAQ'];
    // this.stocksColors = ['#264b96', '#27b376', '#bf212f'];
    this.stocksColors = ['#60AAFF', '#60FFAA', '#FF60AA'];
    this.start = '2015-1-2';
    this.end = '2020-1-2';
    this.isLoading = true;
    this.stocoSubscription = this.stockService.getStocks(this.stocksToAnalyse, this.start, this.end)
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
