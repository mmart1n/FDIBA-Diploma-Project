import { Action } from '@ngrx/store';

export const CHANGE_PASSWORD_START = '[User-Change-Password] Change Password Start';
export const PASSWORD_INTERACTION_COMPLETE = '[User-Change-Password] Password Interaction Complete';
export const CLEAR_MESSAGE = '[User-Change-Password] Clear Message';

export class ChangePasswordStart implements Action {
  readonly type = CHANGE_PASSWORD_START;

  constructor(public payload: { oldPassword: string, newPassword: string }) { }
}

export class PasswordInteractionComplete implements Action {
  readonly type = PASSWORD_INTERACTION_COMPLETE;

  constructor(public payload: string) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type UserChangePasswordActions =
  | ChangePasswordStart
  | PasswordInteractionComplete
  | ClearMessage;
