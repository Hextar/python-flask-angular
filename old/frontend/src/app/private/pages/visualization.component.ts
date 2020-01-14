import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinancialService } from '@private/services/financial.service';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  isLoading = false;
  financial$: BehaviorSubject<any>;
  subscription: Subscription;

  constructor(
    private financialService: FinancialService
  ) {}

  ngOnInit() {
    // this.isLoading = true;
    this.subscription = this.financialService.getStocks()
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
