import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicInitComponent, PublicRoutingModule } from './public-routing.module';
import { AuthenticationComponent } from '@public/pages/authentication.component';


@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  declarations: [
    PublicInitComponent,
    AuthenticationComponent
  ]
})
export class PublicModule {
}
