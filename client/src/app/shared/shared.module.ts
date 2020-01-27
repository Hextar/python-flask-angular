import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MaterialModule } from '@app/material.module';
import { DaavContainerComponent } from '@shared/components/daav-container/daav-container.component';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { DaavTableComponent } from '@shared/components/daav-table/daav-table.component';
import { TableColumnIdPipe } from '@shared/pipes/table-column-id.pipe';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    MatTabsModule,
    RouterModule
  ],
  declarations: [
    DaavContainerComponent,
    DaavTableComponent,
    TableColumnIdPipe,
    SafeHtmlPipe,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    DaavContainerComponent,
    DaavTableComponent,
    TableColumnIdPipe,
    SafeHtmlPipe
  ],
  providers: [
    TableColumnIdPipe,
    SafeHtmlPipe
  ],
  entryComponents: []
})
export class SharedModule {
}
