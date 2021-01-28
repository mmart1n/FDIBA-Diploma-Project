import { Assignment } from 'src/app/models/assignment.model';
import * as AdminManageAssignmentsActions from './admin-manage-assignments.actions';

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

export function adminManageAssignmentsReducer(
  state = initialState,
  action: AdminManageAssignmentsActions.AdminManageAssignmentsActions
) {
  switch (action.type) {
    case AdminManageAssignmentsActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        assignments: [],
        failedAssignments: [],
        connectionFailedError: action.payload,
      };

    case AdminManageAssignmentsActions.FETCH_ASSIGNMENTS_START:
      return {
        ...state,
        loading: true,
        assignments: [],
        connectionFailedError: null
      };

    case AdminManageAssignmentsActions.FETCH_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        assignments: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case AdminManageAssignmentsActions.MANAGE_ASSIGNMENTS_START:
      return {
        ...state,
        loading: true,
        assignments: [],
        failedAssignments: [],
        connectionFailedError: null
      }

    case AdminManageAssignmentsActions.MANAGE_ASSIGNMENTS_PROCEED:
      return {
        ...state,
        loading: false,
        failedAssignments: action.payload,
        connectionFailedError: null
      }

    case AdminManageAssignmentsActions.CLEAR_MESSAGE:
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
