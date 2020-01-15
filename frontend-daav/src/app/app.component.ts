import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import { Logger } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'data-analysis-and-visualization';

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }
  }

  ngOnDestroy() {
    //
  }
}
