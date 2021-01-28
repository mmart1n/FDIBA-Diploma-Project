import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as AdminManageAssignmentsActions from './store/admin-manage-assignments.actions';
import * as AdminManageSubjectsActions from '../manage-subjects/store/admin-manage-subjects.actions';
import * as AdminManageSpecialtiesActions from '../manage-specialties/store/admin-manage-specialties.actions';
import * as AdminManageUsersActions from '../manage-users/store/admin-manage-users.actions';
import { Actions } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class ManageAssignmentsResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new AdminManageSpecialtiesActions.FetchSpecialtiesStart());
    this.store.dispatch(new AdminManageUsersActions.FetchUsersStart());
    this.store.dispatch(new AdminManageAssignmentsActions.FetchAssignmentsStart());
    this.store.dispatch(new AdminManageSubjectsActions.FetchSubjectsStart());
    return true;
  }
}

