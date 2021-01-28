import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducer';
import * as AdminManageAssignmentsActions from './admin-manage-assignments.actions';
import * as AdminManageSubjectsActions from '../../manage-subjects/store/admin-manage-subjects.actions';
import { Store } from '@ngrx/store';
import { Assignment } from '../../../models/assignment.model';

export interface AuthResponseData {
  assignments: {
    assignmentId: number;
    userId: number;
    subjectId: number;
    semesterId: number;
    lectureHours: number;
    labExerciseHours: number;
    seminarHours: number;
    courseProjectHours: number;
    examinationHours: number;
  }[];
}


const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed!';
  return of(new AdminManageAssignmentsActions.ConnectionError(errorMessage));
}

const handleManageAssignments = (assignments: Assignment[]) => {
  return new AdminManageAssignmentsActions.ManageAssignmentsProceed(assignments.length > 0 ? assignments : []);
}

@Injectable()
export class AdminManageAssignmentsEffects {
  @Effect()
  fetchAssignmentsStart = this.actions$.pipe(
    ofType(AdminManageAssignmentsActions.FETCH_ASSIGNMENTS_START),
    switchMap(() => {
      return this.http.get<Assignment[]>(
        'http://95.87.241.188:8080/api/assignments/fetch-assignments'
      ).pipe(map((assignments) => {
        return new AdminManageAssignmentsActions.FetchAssignmentsSuccess(assignments);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageAssignmentsStart = this.actions$.pipe(
    ofType(AdminManageAssignmentsActions.MANAGE_ASSIGNMENTS_START),
    switchMap((actionData: AdminManageAssignmentsActions.ManageAssignmentsStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/assignments/manage-assignments',
        actionData.payload
      ).pipe(
        map((assignments) => {
          return handleManageAssignments(assignments);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageAssignmentsProcceded = this.actions$.pipe(
    ofType(AdminManageAssignmentsActions.MANAGE_ASSIGNMENTS_PROCEED),
    tap(() => {
      return this.store.dispatch(new AdminManageSubjectsActions.FetchSubjectsStart());
    }),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageAssignmentsActions.FetchAssignmentsStart();
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) { }
}

