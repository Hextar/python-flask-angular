import { CustomLoaderComponent } from '@shared/components/custom-loader/custom-loader.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MaterialModule } from '@app/material.module';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatTabsModule,
    RouterModule,
    ContentLoaderModule
  ],
  declarations: [
    CustomTableComponent,
    CustomLoaderComponent,
    SafeHtmlPipe
  ],
  exports: [
    CustomTableComponent,
    CustomLoaderComponent,
    SafeHtmlPipe
  ],
  providers: [
    SafeHtmlPipe
  ],
  entryComponents: []
})
export class SharedModule {
}
