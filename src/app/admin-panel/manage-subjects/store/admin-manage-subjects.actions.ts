import { Action } from '@ngrx/store';
import { Subject } from 'src/app/models/subject.model';

export const FETCH_SUBJECTS_START = '[Admin Panel] Fetch Subjects Start';
export const FETCH_SUBJECTS_SUCCESS = '[Admin Panel] Fetch Subjects Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_SUBJECTS_START = '[Admin Panel] Manage Subjects Start';
export const MANAGE_SUBJECTS_PROCEED = '[Admin Panel] Manage Subjects Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchSubjectsStart implements Action {
  readonly type = FETCH_SUBJECTS_START;
}

export class FetchSubjectsSuccess implements Action {
  readonly type = FETCH_SUBJECTS_SUCCESS;

  constructor(public payload: Subject[]) { }
}

export class ManageSubjectsStart implements Action {
  readonly type = MANAGE_SUBJECTS_START;

  constructor(public payload: any[]) { }
}

export class ManageSubjectsProceed implements Action {
  readonly type = MANAGE_SUBJECTS_PROCEED;

  constructor(public payload: Subject[]) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageSubjectsActions =
  | ConnectionError
  | FetchSubjectsStart
  | FetchSubjectsSuccess
  | ManageSubjectsStart
  | ManageSubjectsProceed
  | ClearMessage;
