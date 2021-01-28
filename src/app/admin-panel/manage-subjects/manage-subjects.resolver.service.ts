import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as AdminManageSubjectsActions from './store/admin-manage-subjects.actions';
import * as AdminManageStateAndSemestersActions from '../manage-state-and-semesters/store/admin-manage-state-and-semesters.actions';
import * as AdminManageSpecialtiesActions from '../manage-specialties/store/admin-manage-specialties.actions';
import { Actions } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class ManageSubjectsResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new AdminManageSpecialtiesActions.FetchSpecialtiesStart());
    this.store.dispatch(new AdminManageStateAndSemestersActions.FetchSemestersStart());
    this.store.dispatch(new AdminManageSubjectsActions.FetchSubjectsStart());
    return true;
  }
}
