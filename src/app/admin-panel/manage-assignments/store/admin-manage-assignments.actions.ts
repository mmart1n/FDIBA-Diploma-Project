import { Action } from '@ngrx/store';
import { Assignment } from 'src/app/models/assignment.model';

export const FETCH_ASSIGNMENTS_START = '[Admin Panel] Fetch Assignments Start';
export const FETCH_ASSIGNMENTS_SUCCESS = '[Admin Panel] Fetch Assignments Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_ASSIGNMENTS_START = '[Admin Panel] Manage Assignments Start';
export const MANAGE_ASSIGNMENTS_PROCEED = '[Admin Panel] Manage Assignments Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchAssignmentsStart implements Action {
  readonly type = FETCH_ASSIGNMENTS_START;
}

export class FetchAssignmentsSuccess implements Action {
  readonly type = FETCH_ASSIGNMENTS_SUCCESS;

  constructor(public payload: Assignment[]) { }
}

export class ManageAssignmentsStart implements Action {
  readonly type = MANAGE_ASSIGNMENTS_START;

  constructor(public payload: any[]) { }
}

export class ManageAssignmentsProceed implements Action {
  readonly type = MANAGE_ASSIGNMENTS_PROCEED;

  constructor(public payload: any[]) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageAssignmentsActions =
  | ConnectionError
  | FetchAssignmentsStart
  | FetchAssignmentsSuccess
  | ManageAssignmentsStart
  | ManageAssignmentsProceed
  | ClearMessage;
