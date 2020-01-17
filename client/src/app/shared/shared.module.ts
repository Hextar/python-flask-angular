import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MaterialModule } from '@app/material.module';
import { DateHelperService } from '@shared/services/data-helper.service';
import { DaavContainerComponent } from '@shared/components/daav-container/daav-container.component';

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
    DaavContainerComponent
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    DaavContainerComponent
  ],
  providers: [
    DateHelperService
  ],
  entryComponents: []
})
export class SharedModule {
}
