import {Component, OnInit, OnDestroy} from '@angular/core';
import { environment } from '@env/environment';
import { I18nService, Logger } from '@app/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { merge } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

export const ChartLang = {
  printChart: 'Stampa grafico',
  downloadPNG: 'Scarica come PNG',
  downloadJPEG: 'Scarica come JPEG',
  downloadPDF: 'Scarica com PDF',
  downloadSVG: 'Scarica SVG',
  contextButtonTitle: 'Menù contestuale',
  months: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre'
  ],
  weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'data-analysis-and-visualization';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private i18nService: I18nService,
    private translateService: TranslateService,
    private titleService: Title,
  ) {
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(
      filter((e: any) => (e ? e instanceof NavigationEnd : false))
    );

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }

  ngOnDestroy() {
    //
  }
}
