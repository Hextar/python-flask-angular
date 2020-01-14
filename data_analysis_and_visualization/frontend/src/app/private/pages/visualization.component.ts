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
    this.subscription = this.financialService.getStocks()
      .subscribe((response: Stock[]) => {
        console.log(response);
        this.isLoading = false;
        this.financial$.next(response);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
