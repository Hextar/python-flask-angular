import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellComponent} from './shell.component';
import {SharedModule} from '@shared/shared.module';
import {RouterModule} from '@angular/router';
import {ShellService} from '@app/shell/service/shell.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ShellComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    ShellService
  ]
})
export class ShellModule {
}
