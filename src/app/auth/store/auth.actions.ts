import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGIN_START = '[Auth] Login Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_MESSAGE = '[Auth] Clear Message';
export const LOGOUT = '[Auth] Logout';
export const RESET_PASSWORD_START = '[Auth] Reset Password Start';
export const PASSWORD_INTERACTION_COMPLETE = '[Auth] Password Interaction Complete';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      username: string;
      userId: number;
      firstName: string;
      middleName: string;
      lastName: string;
      isAdmin: boolean;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) { }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { username: string; password: string }) { }
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) { }
}

export class ResetPasswordStart implements Action {
  readonly type = RESET_PASSWORD_START;

  constructor(public payload: string) { }
}

export class PasswordInteractionComplete implements Action {
  readonly type = PASSWORD_INTERACTION_COMPLETE;

  constructor(public payload: string) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | ClearMessage
  | AutoLogin
  | ResetPasswordStart
  | PasswordInteractionComplete;
