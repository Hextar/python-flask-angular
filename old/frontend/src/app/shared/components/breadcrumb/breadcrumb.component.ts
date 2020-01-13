import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {componentDestroyed} from '@w11k/ngx-componentdestroyed';
import {MonitoringsService} from '@private/services/monitorings.service';
import {Monitoring} from '@app/core/models';
import {BreadCrumb} from '@shared/components/breadcrumb/breadcrumb.constants';

const PRIVACY_POLICY = 'privacy-policy';
const TERMS_OF_SERVICE = 'terms-of-service';
const MONITORING_ID = ':monitoringId';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnDestroy {
  dashboard: any = [{label: 'Dashboard', url: '', clickable: true}];
  public breadcrumbs: BreadCrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private monitoringService: MonitoringsService
  ) {
    const path = this.activatedRoute.routeConfig.path;
    if (path === PRIVACY_POLICY || path === TERMS_OF_SERVICE) {
      this.breadcrumbs = this._buildBreadCrumb(this.activatedRoute.root, '', this.dashboard);
    } else {
      this.breadcrumbs = this._buildBreadCrumb(this.activatedRoute.root, '', []);
    }
  }

  ngOnDestroy() {
    // Empty because '.takeUntil(componentDestroyed(this))' is used
  }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  private _buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadCrumb[] = []
  ): BreadCrumb[] {
    // If no routeConfig is available we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    const isClickable = route.routeConfig && route.routeConfig.data && route.routeConfig.data.isClickable;

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (!label && isDynamicRoute && route.snapshot && false) {
      const paramName = lastRoutePart.split(':')[1];
      if (path === MONITORING_ID) {
        const monitoringId = route.snapshot.params[paramName];
        this.monitoringService.getMonitoring({event_id: monitoringId})
          .takeUntil(componentDestroyed(this))
          .subscribe((m: Monitoring) => {
            label += ' ' + m.title;
            path = path.replace(lastRoutePart, route.snapshot.params[paramName]);

            // In the routeConfig the complete path is not available,
            // so we rebuild it each time
            const nextUrl = path ? `${url}/${path}` : url;
            const breadcrumb: BreadCrumb = {
              label: label,
              url: nextUrl,
              clickable: isClickable
            };

            // Only adding route with non-empty label and that are clickable
            const newBreadcrumbs = (breadcrumb.label && breadcrumb.clickable)
              ? [...breadcrumbs, breadcrumb]
              : [...breadcrumbs];

            if (route.firstChild) {
              // console.log(nextUrl);
              // console.log(newBreadcrumbs);
              // If we are not on our current path yet,
              // there will be more children to look after, to build our breadcumb
              return this._buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
            }

            return newBreadcrumbs;
          });
      }
    } else {
      // In the routeConfig the complete path is not available,
      // so we rebuild it each time
      const nextUrl = path ? `${url}/${path}` : url;
      const breadcrumb: BreadCrumb = {
        label: label,
        url: nextUrl,
        clickable: isClickable
      };

      // Only adding route with non-empty label and that are clickable
      const newBreadcrumbs = (breadcrumb.label && breadcrumb.clickable)
        ? [...breadcrumbs, breadcrumb]
        : [...breadcrumbs];

      if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
        return this._buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      return newBreadcrumbs;
    }
  }
}
