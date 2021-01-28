import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import * as AdminManageUsersActions from './admin-manage-users.actions';

export interface AuthResponseData {
  users: {
    username: string;
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    isAdmin: boolean;
    token: string;
    expiresIn: number
  }[];
}

const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new AdminManageUsersActions.ConnectionError(errorMessage));
}

const handleManageUsers = (users: User[]) => {
  return new AdminManageUsersActions.ManageUsersProceed(users.length > 0 ? users : []);
}

@Injectable()
export class AdminManageUsersEffects {
  @Effect()
  fetchUsersStart = this.actions$.pipe(
    ofType(AdminManageUsersActions.FETCH_USERS_START),
    switchMap(() => {
      return this.http.get<User[]>(
        'http://95.87.241.188:8080/api/users/fetch-users'
      ).pipe(map((users) => {
        return new AdminManageUsersActions.FetchUsersSuccess(users);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageUsersStart = this.actions$.pipe(
    ofType(AdminManageUsersActions.MANAGE_USERS_START),
    switchMap((actionData: AdminManageUsersActions.ManageUsersStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/users/manage',
        actionData.payload
      ).pipe(
        map((users) => {
          return handleManageUsers(users);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageUsersProcceded = this.actions$.pipe(
    ofType(AdminManageUsersActions.MANAGE_USERS_PROCEED),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageUsersActions.FetchUsersStart()
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}

