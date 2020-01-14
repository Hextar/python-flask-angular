import {CanDeactivate} from '@angular/router';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  private _modalDialog: MatDialog;

  constructor(private injector: Injector) {
    this._modalDialog = this.injector.get<MatDialog>(MatDialog as any);
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    if (!(this._modalDialog && this._modalDialog.openDialogs && this._modalDialog.openDialogs.length)) {
      return component.canDeactivate() ? true
        : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
          // when navigating away from your angular app, the browser will show a generic warning message
          // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          'ATTENZIONE: I tuoi dati non sono stati salvati. Premi \'Cancel\' per rimanere in questa pagina,' +
          'oppure \'OK\' per uscire.'
        );
    }
  }
}


@Injectable()
export class DialogOpenedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ? true : false;
  }
}
