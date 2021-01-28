import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import * as UserChangePasswordActions from './user-change-password.actions';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';

const handlePasswordInteractionCompletion: any = (success: boolean) => {
  let message: string = success ? 'You have successfully changed your password!' : 'Something went wrong! Please try again!';
  if (success) {
    return new UserChangePasswordActions.PasswordInteractionComplete(message);
  }
  return of(new UserChangePasswordActions.PasswordInteractionComplete(message));
}

@Injectable()
export class UserChangePasswordEffects {
  @Effect()
  storeRecipes = this.actions$.pipe(
    ofType(UserChangePasswordActions.CHANGE_PASSWORD_START),
    withLatestFrom(this.store.select('auth')),
    switchMap(([changePasswordData, authState]: any[]) => {
      return this.http.post<any>('http://95.87.241.188:8080/api/users/' + authState.user.userId + '/change-password', {
        oldPassword: changePasswordData.payload.oldPassword,
        newPassword: changePasswordData.payload.newPassword
      })
        .pipe(
          map((resData) => {
            return handlePasswordInteractionCompletion(true);
          }),
          catchError((resData) => {
            return handlePasswordInteractionCompletion(false);
          })
        );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) { }
}
