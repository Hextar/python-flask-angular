import {PreloadingStrategy, Route, RouterModule, Routes} from '@angular/router';
import {Injectable, NgModule} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/internal/observable/of';
import {environment} from '@env/environment';
import {ShellService} from '@app/shell/service/shell.service';

@Injectable({providedIn: 'root'})
export class AuthPreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      this.preloadedModules.push(route.path);
      return load();
    }
    return of(null);
  }
}

const routes: Routes = ShellService.childRoutes([
  {
    path: 'public',
    loadChildren: () => import('@public/public.module').then(m => m.PublicModule),
    data: {
      isClickable: false,
      breadcrumb: 'Public',
      data: {
        data: {title: 'Public area'}
      }
    },
  },
  {
    path: 'private',
    loadChildren: () => import('@private/private.module').then(m => m.PrivateModule),
    data: {
      isClickable: false,
      breadcrumb: 'Private',
      data: {
        data: {title: 'Private area'}
      }
    },
  },
  {
    path: '', redirectTo: 'private', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'private', pathMatch: 'full'
  }
]);

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      preloadingStrategy: AuthPreloadingStrategy,
      useHash: environment.production,
      scrollPositionRestoration: 'disabled'
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}




