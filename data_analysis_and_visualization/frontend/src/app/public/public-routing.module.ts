import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from '@public/pages/authentication.component';

@Component({
  selector: 'app-public-init',
  template: `<router-outlet></router-outlet>`
})
export class PublicInitComponent {
}

const routes: Routes = [
  {
    path: '',
    component: PublicInitComponent,
    children: [
      {
        path: 'auth',
        component: AuthenticationComponent,
        data: {
          isClickable: true,
          breadcrumb: 'Crea Monitoring',
          data: {
            title: 'Authentication'
          }
        }
      },
      {
        path: '', redirectTo: 'visualization', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
