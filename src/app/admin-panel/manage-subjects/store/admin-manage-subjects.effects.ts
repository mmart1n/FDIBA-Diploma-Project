import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as AdminManageSubjectsActions from './admin-manage-subjects.actions';
import { Subject } from '../../../models/subject.model';

export interface AuthResponseData {
  subjects: {
    subjectId: number;
    subjectName: string;
    subjectBachelor: boolean;
    coursesAmount: number
  }[];
}

const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new AdminManageSubjectsActions.ConnectionError(errorMessage));
}

const handleManageSubjects = (subjects: Subject[]) => {
  return new AdminManageSubjectsActions.ManageSubjectsProceed(subjects.length > 0 ? subjects : []);
}

@Injectable()
export class AdminManageSubjectsEffects {
  @Effect()
  fetchSubjectsStart = this.actions$.pipe(
    ofType(AdminManageSubjectsActions.FETCH_SUBJECTS_START),
    switchMap(() => {
      return this.http.get<Subject[]>(
        'http://95.87.241.188:8080/api/fetch-subjects'
      ).pipe(map((subjects) => {
        return new AdminManageSubjectsActions.FetchSubjectsSuccess(subjects);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageSubjectsStart = this.actions$.pipe(
    ofType(AdminManageSubjectsActions.MANAGE_SUBJECTS_START),
    switchMap((actionData: AdminManageSubjectsActions.ManageSubjectsStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/admin/manage-subjects',
        actionData.payload
      ).pipe(
        map((subjects) => {
          return handleManageSubjects(subjects);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageSubjectsProcceded = this.actions$.pipe(
    ofType(AdminManageSubjectsActions.MANAGE_SUBJECTS_PROCEED),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageSubjectsActions.FetchSubjectsStart()
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}

