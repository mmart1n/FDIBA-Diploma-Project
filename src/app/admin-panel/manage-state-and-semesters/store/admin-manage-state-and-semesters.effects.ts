import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as AdminManageStateAndSemestersActions from './admin-manage-state-and-semesters.actions';
import { Semester } from '../../../models/semester.model';

export interface AuthResponseData {
  semesters: {
    semesterId: number;
    semesterName: string;
    semesterPeriod: string;
    isActivate: boolean
  }[];
}

const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new AdminManageStateAndSemestersActions.ConnectionError(errorMessage));
}

const handleManageSemesters = (semesters: Semester[]) => {
  return new AdminManageStateAndSemestersActions.ManageSemestersProceed(semesters.length > 0 ? semesters : []);
}

@Injectable()
export class AdminManageStateAndSemestersEffects {
  @Effect()
  fetchSemestersStart = this.actions$.pipe(
    ofType(AdminManageStateAndSemestersActions.FETCH_SEMESTERS_START),
    switchMap(() => {
      return this.http.get<Semester[]>(
        'http://95.87.241.188:8080/api/admin/fetch-semesters'
      ).pipe(map((semesters) => {
        return new AdminManageStateAndSemestersActions.FetchSemestersSuccess(semesters);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageSemestersStart = this.actions$.pipe(
    ofType(AdminManageStateAndSemestersActions.MANAGE_SEMESTERS_START),
    switchMap((actionData: AdminManageStateAndSemestersActions.ManageSemestersStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/admin/manage-semesters',
        actionData.payload
      ).pipe(
        map((semesters) => {
          return handleManageSemesters(semesters);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageSemestersProcceded = this.actions$.pipe(
    ofType(AdminManageStateAndSemestersActions.MANAGE_SEMESTERS_PROCEED),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageStateAndSemestersActions.FetchSemestersStart()
    })
  );

  @Effect()
  changeActiveSemesterStart = this.actions$.pipe(
    ofType(AdminManageStateAndSemestersActions.CHANGE_ACTIVE_SEMESTER_START),
    switchMap((actionData: AdminManageStateAndSemestersActions.ChangeActiveSemesterStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/admin/set-active-semester',
        actionData.payload
      ).pipe(
        map(() => {
          return new AdminManageStateAndSemestersActions.FetchSemestersStart();
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}

