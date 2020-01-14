import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MaterialModule } from '@app/material.module';

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
  ],
  exports: [
  ],
  providers: [
  ],
  entryComponents: []
})
export class SharedModule {
}
