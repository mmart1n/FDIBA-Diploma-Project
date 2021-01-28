import { Subject } from 'src/app/models/subject.model';
import * as AdminManageSubjectsActions from './admin-manage-subjects.actions';

export interface State {
  subjects: Subject[];
  failedSubjects: Subject[];
  connectionFailedError: string;
  loading: boolean;
}

const initialState: State = {
  subjects: [],
  failedSubjects: [],
  connectionFailedError: null,
  loading: true
};

export function adminManageSubjectsReducer(
  state = initialState,
  action: AdminManageSubjectsActions.AdminManageSubjectsActions
) {
  switch (action.type) {
    case AdminManageSubjectsActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        subjects: [],
        failedSubjects: [],
        connectionFailedError: action.payload,
      };

    case AdminManageSubjectsActions.FETCH_SUBJECTS_START:
      return {
        ...state,
        loading: true,
        subjects: [],
        connectionFailedError: null
      };

    case AdminManageSubjectsActions.FETCH_SUBJECTS_SUCCESS:
      return {
        ...state,
        subjects: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case AdminManageSubjectsActions.MANAGE_SUBJECTS_START:
      return {
        ...state,
        loading: true,
        subjects: [],
        failedSubjects: [],
        connectionFailedError: null
      }

    case AdminManageSubjectsActions.MANAGE_SUBJECTS_PROCEED:
      return {
        ...state,
        loading: false,
        failedSubjects: action.payload,
        connectionFailedError: null
      }

    case AdminManageSubjectsActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        failedSubjects: [],
        connectionFailedError: null
      }

    default:
      return state;
  }
}
