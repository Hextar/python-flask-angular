import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MAT_DATE_LOCALE, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppHammerConfig } from '../hammer.config';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { ShellModule } from '@app/shell/shell.module';

@NgModule({
  imports: [
    BrowserModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    TranslateModule.forRoot(),
    CoreModule,
    SharedModule,
    ShellModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig
    },
    {
      provide: LOCALE_ID,
      useValue: 'it-IT'
    },
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID
    }
  ]
})
export class AppModule {
}
