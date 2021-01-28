import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import * as AdminManageSpecialtiesActions from './admin-manage-specialties.actions';
import { Specialty } from '../../../models/specialty.model';

export interface AuthResponseData {
  specialties: {
    specialtyId: number;
    specialtyName: string;
    specialtyBachelor: boolean;
    coursesAmount: number
  }[];
}

const handleConnectionError = () => {
  let errorMessage = 'Connection to the backend has failed! Please reload the page and try again!';
  return of(new AdminManageSpecialtiesActions.ConnectionError(errorMessage));
}

const handleManageSpecialties = (specialties: Specialty[]) => {
  return new AdminManageSpecialtiesActions.ManageSpecialtiesProceed(specialties.length > 0 ? specialties : []);
}

@Injectable()
export class AdminManageSpecialtiesEffects {
  @Effect()
  fetchSpecialtiesStart = this.actions$.pipe(
    ofType(AdminManageSpecialtiesActions.FETCH_SPECIALTIES_START),
    switchMap(() => {
      return this.http.get<Specialty[]>(
        'http://95.87.241.188:8080/api/admin/fetch-specialties'
      ).pipe(map((specialties) => {
        return new AdminManageSpecialtiesActions.FetchSpecialtiesSuccess(specialties);
      }),
        catchError(() => {
          return handleConnectionError();
        }))
    })
  );

  @Effect()
  manageSpecialtiesStart = this.actions$.pipe(
    ofType(AdminManageSpecialtiesActions.MANAGE_SPECIALTIES_START),
    switchMap((actionData: AdminManageSpecialtiesActions.ManageSpecialtiesStart) => {
      return this.http.post<any[]>(
        'http://95.87.241.188:8080/api/admin/manage-specialties',
        actionData.payload
      ).pipe(
        map((specialties) => {
          return handleManageSpecialties(specialties);
        }),
        catchError(() => {
          return handleConnectionError();
        })
      )
    })
  );

  @Effect()
  manageSpecialtiesProcceded = this.actions$.pipe(
    ofType(AdminManageSpecialtiesActions.MANAGE_SPECIALTIES_PROCEED),
    map(() => {
      // DALI TAKA SE PRAVI
      return new AdminManageSpecialtiesActions.FetchSpecialtiesStart()
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { }
}

