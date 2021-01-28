import { Assignment } from 'src/app/models/assignment.model';
import * as UserAssignmentsActions from './user-assignments.actions';

export interface State {
  assignments: Assignment[];
  failedAssignments: Assignment[];
  connectionFailedError: string;
  loading: boolean;
}

const initialState: State = {
  assignments: [],
  failedAssignments: [],
  connectionFailedError: null,
  loading: true
};

export function userAssignmentsReducer(
  state = initialState,
  action: UserAssignmentsActions.UserAssignmentsActions
) {
  switch (action.type) {
    case UserAssignmentsActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        assignments: [],
        failedAssignments: [],
        connectionFailedError: action.payload,
      };

    case UserAssignmentsActions.FETCH_USER_ASSIGNMENTS_START:
      return {
        ...state,
        loading: true,
        assignments: [],
        connectionFailedError: null
      };

    case UserAssignmentsActions.FETCH_USER_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        assignments: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case UserAssignmentsActions.MANAGE_USER_ASSIGNMENTS_START:
      return {
        ...state,
        loading: true,
        assignments: [],
        failedAssignments: [],
        connectionFailedError: null
      }

    case UserAssignmentsActions.MANAGE_USER_ASSIGNMENTS_PROCEED:
      return {
        ...state,
        loading: false,
        failedAssignments: action.payload,
        connectionFailedError: null
      }

    case UserAssignmentsActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        failedAssignments: [],
        connectionFailedError: null
      }

    default:
      return state;
  }
}
