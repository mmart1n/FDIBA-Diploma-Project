import { Action } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const FETCH_USERS_START = '[Admin Panel] Fetch Users Start';
export const FETCH_USERS_SUCCESS = '[Admin Panel] Fetch Users Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_USERS_START = '[Admin Panel] Manage Users Start';
export const MANAGE_USERS_PROCEED = '[Admin Panel] Manage Users Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchUsersStart implements Action {
  readonly type = FETCH_USERS_START;
}

export class FetchUsersSuccess implements Action {
  readonly type = FETCH_USERS_SUCCESS;

  constructor(public payload: User[]) { }
}

export class ManageUsersStart implements Action {
  readonly type = MANAGE_USERS_START;

  constructor(public payload: any[]) { }
}

export class ManageUsersProceed implements Action {
  readonly type = MANAGE_USERS_PROCEED;

  constructor(public payload: User[]) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageUsersActions =
  | ConnectionError
  | FetchUsersStart
  | FetchUsersSuccess
  | ManageUsersStart
  | ManageUsersProceed
  | ClearMessage;
