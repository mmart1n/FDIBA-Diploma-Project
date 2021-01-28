import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as AdminManageSpecialtiesActions from './store/admin-manage-specialties.actions';
import { Actions } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class ManageSpecialtiesResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new AdminManageSpecialtiesActions.FetchSpecialtiesStart());
    return true;
  }
}
