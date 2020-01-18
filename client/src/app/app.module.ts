import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MomentModule } from 'ngx-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MAT_DATE_LOCALE, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppHammerConfig } from '../hammer.config';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@app/core';
import { AppRoutingModule } from '@app/app-routing.module';
import { ShellModule } from '@app/shell/shell.module';
import { registerLocaleData } from '@angular/common';
import localeITA from '@angular/common/locales/it';

registerLocaleData(localeITA);


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
      useValue: 'en-US'
    },
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID
    }
  ]
})
export class AppModule {
}
