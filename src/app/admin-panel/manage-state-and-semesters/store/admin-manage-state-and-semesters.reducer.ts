import { Semester } from 'src/app/models/semester.model';
import * as AdminManageStateAndSemestersActions from './admin-manage-state-and-semesters.actions';

export interface State {
  semesters: any[];
  failedSemesters: Semester[];
  connectionFailedError: string;
  loading: boolean;
  siteWorking: boolean;
}

const initialState: State = {
  semesters: [],
  failedSemesters: [],
  connectionFailedError: null,
  loading: true,
  siteWorking: false
};

export function adminManageStateAndSemestersReducer(
  state = initialState,
  action: AdminManageStateAndSemestersActions.AdminManageStateAndSemestersActions
) {
  switch (action.type) {
    case AdminManageStateAndSemestersActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        failedSemesters: [],
        siteWorking: false,
        connectionFailedError: action.payload,
      };

    case AdminManageStateAndSemestersActions.FETCH_SEMESTERS_START:
      return {
        ...state,
        loading: true,
        semesters: [],
        connectionFailedError: null
      };

    case AdminManageStateAndSemestersActions.FETCH_SEMESTERS_SUCCESS:
      return {
        ...state,
        semesters: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case AdminManageStateAndSemestersActions.MANAGE_SEMESTERS_START:
      return {
        ...state,
        loading: true,
        semesters: [],
        failedSemesters: [],
        connectionFailedError: null
      }

    case AdminManageStateAndSemestersActions.MANAGE_SEMESTERS_PROCEED:
      return {
        ...state,
        loading: false,
        failedSemesters: action.payload,
        connectionFailedError: null
      }

    case AdminManageStateAndSemestersActions.CHANGE_ACTIVE_SEMESTER_START:
      return {
        ...state,
        loading: true,
        connectionFailedError: null
      }

    case AdminManageStateAndSemestersActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        failedSemesters: [],
        connectionFailedError: null
      }

    default:
      return state;
  }
}
