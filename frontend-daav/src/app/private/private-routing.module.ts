import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualizationComponent } from '@private/pages/visualization.component';

@Component({
  selector: 'app-private-init',
  template: `<router-outlet></router-outlet>`,
})
export class PrivateInitComponent {}

const routes: Routes = [
  {
    path: '',
    component: PrivateInitComponent,
    children: [
      {
        path: 'visualization',
        component: VisualizationComponent,
        data: {
          data: {
            title: 'Visualization'
          }
        }
      },
      {
        path: '', redirectTo: 'visualization', pathMatch: 'full'
      },
      {
        path: '**', redirectTo: 'visualization', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
