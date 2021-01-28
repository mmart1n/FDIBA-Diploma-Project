import { Action } from '@ngrx/store';
import { Assignment } from 'src/app/models/assignment.model';

export const FETCH_USER_ASSIGNMENTS_START = '[Admin Panel] Fetch User Assignments Start';
export const FETCH_USER_ASSIGNMENTS_SUCCESS = '[Admin Panel] Fetch User Assignments Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_USER_ASSIGNMENTS_START = '[Admin Panel] Manage User Assignments Start';
export const MANAGE_USER_ASSIGNMENTS_PROCEED = '[Admin Panel] Manage User Assignments Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchUserAssignmentsStart implements Action {
  readonly type = FETCH_USER_ASSIGNMENTS_START;

  constructor(public payload: number) { }
}

export class FetchUserAssignmentsSuccess implements Action {
  readonly type = FETCH_USER_ASSIGNMENTS_SUCCESS;

  constructor(public payload: Assignment[]) { }
}

export class ManageUserAssignmentsStart implements Action {
  readonly type = MANAGE_USER_ASSIGNMENTS_START;

  constructor(public payload: any[]) { }
}

export class ManageUserAssignmentsProceed implements Action {
  readonly type = MANAGE_USER_ASSIGNMENTS_PROCEED;

  constructor(public payload: Assignment[]) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type UserAssignmentsActions =
  | ConnectionError
  | FetchUserAssignmentsStart
  | FetchUserAssignmentsSuccess
  | ManageUserAssignmentsStart
  | ManageUserAssignmentsProceed
  | ClearMessage;
