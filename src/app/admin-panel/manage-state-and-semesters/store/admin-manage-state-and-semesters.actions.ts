import { Action } from '@ngrx/store';
import { Semester } from 'src/app/models/semester.model';

export const FETCH_SEMESTERS_START = '[Admin Panel] Fetch Semesters Start';
export const FETCH_SEMESTERS_SUCCESS = '[Admin Panel] Fetch Semesters Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_SEMESTERS_START = '[Admin Panel] Manage Semesters Start';
export const MANAGE_SEMESTERS_PROCEED = '[Admin Panel] Manage Semesters Proceed';
export const CHANGE_ACTIVE_SEMESTER_START = '[Admin Panel] Change Active Semester Start'
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchSemestersStart implements Action {
  readonly type = FETCH_SEMESTERS_START;
}

export class FetchSemestersSuccess implements Action {
  readonly type = FETCH_SEMESTERS_SUCCESS;

  constructor(public payload: Semester[]) { }
}

export class ManageSemestersStart implements Action {
  readonly type = MANAGE_SEMESTERS_START;

  constructor(public payload: any[]) { }
}

export class ManageSemestersProceed implements Action {
  readonly type = MANAGE_SEMESTERS_PROCEED;

  constructor(public payload: Semester[]) { }
}

export class ChangeActiveSemesterStart implements Action {
  readonly type = CHANGE_ACTIVE_SEMESTER_START;

  constructor(public payload: number) { }
}
export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageStateAndSemestersActions =
  | ConnectionError
  | FetchSemestersStart
  | FetchSemestersSuccess
  | ManageSemestersStart
  | ManageSemestersProceed
  | ChangeActiveSemesterStart
  | ClearMessage;
