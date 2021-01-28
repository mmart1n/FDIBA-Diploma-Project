import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../../../store/app.reducer';
import * as UserAssignmentsActions from './user-assignments.actions';
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
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new UserAssignmentsActions.ConnectionError(errorMessage));
}

const handleManageUserAssignments = (assignments: Assignment[]) => {
  return new UserAssignmentsActions.ManageUserAssignmentsProceed(assignments.length > 0 ? assignments : []);
}

@Injectable()
export class UserAssignmentsEffects {
  @Effect()
  fetchAssignmentsStart = this.actions$.pipe(
    ofType(UserAssignmentsActions.FETCH_USER_ASSIGNMENTS_START),
    switchMap((actionData: UserAssignmentsActions.FetchUserAssignmentsStart) => {
      return this.http.get<Assignment[]>(
        'http://95.87.241.188:8080/api/assignments/fetch-assignments/' + actionData.payload
      ).pipe(map((assignments) => {
        return new UserAssignmentsActions.FetchUserAssignmentsSuccess(assignments);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageAssignmentsStart = this.actions$.pipe(
    ofType(UserAssignmentsActions.MANAGE_USER_ASSIGNMENTS_START),
    withLatestFrom(this.store.select('auth')),
    switchMap(([actionData, authState]: any[]) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/assignments/update-user-assignments/',
        actionData.payload
      ).pipe(
        map((assignments) => {
          return handleManageUserAssignments(assignments);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageAssignmentsProcceded = this.actions$.pipe(
    ofType(UserAssignmentsActions.MANAGE_USER_ASSIGNMENTS_PROCEED),
    withLatestFrom(this.store.select('auth')),
    map(([actionData, authState]: any[]) => {
      // DALI TAKA SE PRAVI
      if (authState.user && authState.user.userId >= 0) {
        debugger;
        return new UserAssignmentsActions.FetchUserAssignmentsStart(authState.user.userId);
      }
      return handleConnectionError();
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) { }
}

