import { Action } from '@ngrx/store';
export const FETCH_SITE_STATE_START = '[Admin Panel] Fetch Site State Start';
export const FETCH_SITE_STATE_SUCCESS = '[Admin Panel] Fetch Site State Success';
export const CHANGE_SITE_STATE_START = '[Admin Panel] Change Site State Start'
export const FETCH_STATES_TEXTS_START = '[Admin Panel] Fetch States Texts Start';
export const FETCH_STATES_TEXTS_SUCCESS = '[Admin Panel] Fetch States Texts Success';
export const CONNECTION_ERROR = '[Admin Panel] Connection Error';
export const UPDATE_STATE_TEXT_START = '[Admin Panel] Update State Text Start';
export const UPDATE_STATE_TEXT_PROCEED = '[Admin Panel] Update State Text Proceed';
export const CLEAR_MESSAGE = '[Admin Panel] Clear Message';

export class ConnectionError implements Action {
  readonly type = CONNECTION_ERROR;

  constructor(public payload: string) { }
}

export class FetchSiteStateStart implements Action {
  readonly type = FETCH_SITE_STATE_START;
}

export class FetchSiteStateSuccess implements Action {
  readonly type = FETCH_SITE_STATE_SUCCESS;

  constructor(public payload: { id: number, working: boolean, text: string, active: boolean }) { }
}

export class ChangeSiteStateStart implements Action {
  readonly type = CHANGE_SITE_STATE_START;

  constructor(public payload: boolean) { }
}

export class FetchStatesTextsStart implements Action {
  readonly type = FETCH_STATES_TEXTS_START;
}

export class FetchStatesTextsSuccess implements Action {
  readonly type = FETCH_STATES_TEXTS_SUCCESS;

  constructor(public payload: { id: number, working: boolean, text: string, active: boolean }[]) { }
}

export class UpdateStateTextStart implements Action {
  readonly type = UPDATE_STATE_TEXT_START;

  constructor(public payload: { status: boolean, content: string }) { }
}

export class UpdateStateTextProceed implements Action {
  readonly type = UPDATE_STATE_TEXT_PROCEED;

  constructor(public payload: string) { }
}

export class ClearMessage implements Action {
  readonly type = CLEAR_MESSAGE;
}

export type AdminManageHomePageActions =
  | ConnectionError
  | FetchSiteStateStart
  | FetchSiteStateSuccess
  | ChangeSiteStateStart
  | FetchStatesTextsStart
  | FetchStatesTextsSuccess
  | UpdateStateTextStart
  | UpdateStateTextProceed
  | ClearMessage;
