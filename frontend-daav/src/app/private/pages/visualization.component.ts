import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinancialService } from '@private/services/financial.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Stock } from '@private/models/stock.model';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  isLoading = false;
  financial$ = new BehaviorSubject<Stock[]>({} as Stock[]);
  subscription: Subscription;

  constructor(
    private financialService: FinancialService
  ) {}

  ngOnInit() {
    // this.isLoading = true;
    const stocksToAnalyse = ['CROP', 'UGA', 'NDAQ'];
    const start = '2020-1-1';
    const end = '2020-1-5';
    this.subscription = this.financialService.getStocks(stocksToAnalyse, start, end)
      .subscribe((response: any) => {
        console.log(response);
        this.isLoading = false;
        this.financial$.next(response);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
