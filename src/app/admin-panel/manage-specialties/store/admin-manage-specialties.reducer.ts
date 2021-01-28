import { Specialty } from 'src/app/models/specialty.model';
import * as AdminManageSpecialtiesActions from './admin-manage-specialties.actions';

export interface State {
  specialties: Specialty[];
  failedSpecialties: Specialty[];
  connectionFailedError: string;
  loading: boolean;
}

const initialState: State = {
  specialties: [],
  failedSpecialties: [],
  connectionFailedError: null,
  loading: true
};

export function adminManageSpecialtiesReducer(
  state = initialState,
  action: AdminManageSpecialtiesActions.AdminManageSpecialtiesActions
) {
  switch (action.type) {
    case AdminManageSpecialtiesActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        specialties: [],
        failedSpecialties: [],
        connectionFailedError: action.payload,
      };

    case AdminManageSpecialtiesActions.FETCH_SPECIALTIES_START:
      return {
        ...state,
        loading: true,
        specialties: [],
        connectionFailedError: null
      };

    case AdminManageSpecialtiesActions.FETCH_SPECIALTIES_SUCCESS:
      return {
        ...state,
        specialties: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case AdminManageSpecialtiesActions.MANAGE_SPECIALTIES_START:
      return {
        ...state,
        loading: true,
        specialties: [],
        failedSpecialties: [],
        connectionFailedError: null
      }

    case AdminManageSpecialtiesActions.MANAGE_SPECIALTIES_PROCEED:
      return {
        ...state,
        loading: false,
        failedSpecialties: action.payload,
        connectionFailedError: null
      }

    case AdminManageSpecialtiesActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        failedSpecialties: [],
        connectionFailedError: null
      }

    default:
      return state;
  }
}
