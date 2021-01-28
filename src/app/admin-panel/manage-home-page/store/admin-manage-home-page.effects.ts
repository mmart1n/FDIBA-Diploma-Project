import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as AdminManageHomePageActions from './admin-manage-home-page.actions';

const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new AdminManageHomePageActions.ConnectionError(errorMessage));
}

const handleUpdateStateTextSuccess = () => {
  let message = 'You have successfully updated the state text!';
  return new AdminManageHomePageActions.UpdateStateTextProceed(message);
}

@Injectable()
export class AdminManageHomePageEffects {
  @Effect()
  fetchSiteStateStart = this.actions$.pipe(
    ofType(AdminManageHomePageActions.FETCH_SITE_STATE_START),
    switchMap(() => {
      return this.http.get<{ id: number, working: boolean, text: string, active: boolean }>(
        'http://95.87.241.188:8080/api/admin/fetch-state'
      ).pipe(map((state) => {
        return new AdminManageHomePageActions.FetchSiteStateSuccess(state);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  changeSiteStateStart = this.actions$.pipe(
    ofType(AdminManageHomePageActions.CHANGE_SITE_STATE_START),
    switchMap((actionData: AdminManageHomePageActions.ChangeSiteStateStart) => {
      return this.http.post<boolean>(
        'http://95.87.241.188:8080/api/admin/change-state',
        actionData.payload
      ).pipe(
        map(() => {
          return new AdminManageHomePageActions.FetchSiteStateStart();
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  fetchStatesTextsStart = this.actions$.pipe(
    ofType(AdminManageHomePageActions.FETCH_STATES_TEXTS_START),
    switchMap(() => {
      return this.http.get<{ id: number, working: boolean, text: string, active: boolean }[]>(
        'http://95.87.241.188:8080/api/home/fetch-states-texts'
      ).pipe(map((currentStateText) => {
        return new AdminManageHomePageActions.FetchStatesTextsSuccess(currentStateText);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );


  @Effect()
  updateStateTextStart = this.actions$.pipe(
    ofType(AdminManageHomePageActions.UPDATE_STATE_TEXT_START),
    switchMap((actionData: AdminManageHomePageActions.UpdateStateTextStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/home/update-state-text',
        actionData.payload
      ).pipe(
        map((statesTexts) => {
          return handleUpdateStateTextSuccess();
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  updateStateTextStartProceed = this.actions$.pipe(
    ofType(AdminManageHomePageActions.UPDATE_STATE_TEXT_PROCEED),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageHomePageActions.FetchStatesTextsStart();
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}

