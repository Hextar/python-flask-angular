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
    component: VisualizationComponent,
    data: {
      title: 'Private area'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
