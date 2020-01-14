import {Routes} from '@angular/router';
import {ShellComponent} from '@app/shell/shell.component';

export class ShellService {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return {Route} The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Routes {
    return [
      {
        path: '',
        component: ShellComponent,
        children: routes,
        // Reuse ShellComponent instance when navigating between child views
        data: {reuse: true}
      }
    ];
  }
}
