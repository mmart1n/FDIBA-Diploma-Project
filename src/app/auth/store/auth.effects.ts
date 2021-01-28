import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  username: string;
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  isAdmin: boolean;
  token: string;
  expiresIn: number;
}

const handleAuthentication = (
  username: string,
  userId: number,
  firstName: string,
  middleName: string,
  lastName: string,
  isAdmin: boolean,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(expiresIn);
  const user = new User(username, userId, firstName, middleName, lastName, isAdmin, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    username,
    userId,
    firstName,
    middleName,
    lastName,
    isAdmin,
    token,
    expirationDate,
    redirect: true,
  });
}

//STAYKO DA OPRAVI ERROR MESSAGITE!!!!!!!!!!!!!
const handleAuthenticationError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occured!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exists!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct!';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

const handlePasswordInteractionCompletion: any = (success: boolean) => {
  let message: string = success ? 'Your new password has been successfully sent to your email!' : 'Something went wrong! Please try again!';
  if (success) {
    return new AuthActions.PasswordInteractionComplete(message);
  }
  return of(new AuthActions.PasswordInteractionComplete(message));
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'http://95.87.241.188:8080/api/users/signin',
          {
            username: authData.payload.username,
            password: authData.payload.password
          },
          { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }), observe: "response" },
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(new Date(+resData.headers.get('expires')));
          }),
          map((resData) => {
            return handleAuthentication(
              resData.body.username,
              +resData.body.id,
              resData.body.firstName,
              resData.body.middleName,
              resData.body.lastName,
              resData.body.isAdmin,
              resData.headers.get('Authorization'),
              +resData.headers.get('expires')
            );
          }),
          catchError((errorResponse) => {
            return handleAuthenticationError(errorResponse);
          })
        );
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        username: string;
        userId: number;
        firstName: string;
        middleName: string;
        lastName: string;
        isAdmin: boolean;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !(userData && new Date(userData._tokenExpirationDate).getTime() - new Date().getTime() > 120000)) {
        return { type: 'null' };
      }

      const loadedUser = new User(
        userData.username,
        userData.userId,
        userData.firstName,
        userData.middleName,
        userData.lastName,
        userData.isAdmin,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        this.authService.setLogoutTimer(loadedUser.tokenExpirationDate);
        return new AuthActions.AuthenticateSuccess({
          username: loadedUser.username,
          userId: loadedUser.userId,
          firstName: loadedUser.firstName,
          middleName: loadedUser.middleName,
          lastName: loadedUser.lastName,
          isAdmin: loadedUser.isAdmin,
          token: loadedUser.token,
          expirationDate: loadedUser.tokenExpirationDate,
          redirect: false,
        });
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogot = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/sign-in']);
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  resetPasswordStart = this.actions$.pipe(
    ofType(AuthActions.RESET_PASSWORD_START),
    switchMap((authData: AuthActions.ResetPasswordStart) => {
      return this.http.post<any>('http://95.87.241.188:8080/api/users/request-password-reset', null,
        {
          headers: new HttpHeaders({ 'username': authData.payload }), observe: 'response'
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
    private router: Router,
    private authService: AuthService
  ) { }
}

