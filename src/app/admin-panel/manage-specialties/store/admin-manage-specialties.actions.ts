import { Action } from '@ngrx/store';
import { Specialty } from 'src/app/models/specialty.model';

export const FETCH_SPECIALTIES_START = '[Admin Panel] Fetch Specialties Start';
export const FETCH_SPECIALTIES_SUCCESS = '[Admin Panel] Fetch Specialties Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const MANAGE_SPECIALTIES_START = '[Admin Panel] Manage Specialties Start';
export const MANAGE_SPECIALTIES_PROCEED = '[Admin Panel] Manage Specialties Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchSpecialtiesStart implements Action {
  readonly type = FETCH_SPECIALTIES_START;
}

export class FetchSpecialtiesSuccess implements Action {
  readonly type = FETCH_SPECIALTIES_SUCCESS;

  constructor(public payload: Specialty[]) { }
}

export class ManageSpecialtiesStart implements Action {
  readonly type = MANAGE_SPECIALTIES_START;

  constructor(public payload: any[]) { }
}

export class ManageSpecialtiesProceed implements Action {
  readonly type = MANAGE_SPECIALTIES_PROCEED;

  constructor(public payload: Specialty[]) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageSpecialtiesActions =
  | ConnectionError
  | FetchSpecialtiesStart
  | FetchSpecialtiesSuccess
  | ManageSpecialtiesStart
  | ManageSpecialtiesProceed
  | ClearMessage;
