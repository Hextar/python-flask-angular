import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-analysis-and-visualization';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private titleService: Title
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data &&    child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe( (data: any) => {
      if (data) {
        this.titleService.setTitle(data + ' - Data Analysis and Visualization');
      }
    });
    /** ADD LOGO */
    this.matIconRegistry.addSvgIcon('logo', this._dsbstr('logo.svg'));
    /** ADD LOGO CIRCLED*/
    this.matIconRegistry.addSvgIcon('logo_circled', this._dsbstr('logo_circled.svg'));
  }

  private _dsbstr(s: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(s);
  }
}
