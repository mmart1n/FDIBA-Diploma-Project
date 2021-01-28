import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as UserAssignmentsActions from './store/user-assignments.actions';
import { Actions } from '@ngrx/effects';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserAssignmentsResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      map((user: User) => {
        if (user.userId >= 0) {
          this.store.dispatch(new UserAssignmentsActions.FetchUserAssignmentsStart(user.userId));
          return true;
        }
        return false;
      })
    );
  }
}
