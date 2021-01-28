import { User } from 'src/app/models/user.model';
import * as AdminManageUsersActions from './admin-manage-users.actions';

export interface State {
  users: User[];
  failedUsers: User[];
  connectionFailedError: string;
  loading: boolean;
}

const initialState: State = {
  users: [],
  failedUsers: [],
  connectionFailedError: null,
  loading: true
};

export function adminManageUserReducer(
  state = initialState,
  action: AdminManageUsersActions.AdminManageUsersActions
) {
  switch (action.type) {
    case AdminManageUsersActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        users: [],
        failedUsers: [],
        connectionFailedError: action.payload,
      };

    case AdminManageUsersActions.FETCH_USERS_START:
      return {
        ...state,
        loading: true,
        users: [],
        connectionFailedError: null
      };

    case AdminManageUsersActions.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: [...action.payload],
        loading: false,
        connectionFailedError: null
      };

    case AdminManageUsersActions.MANAGE_USERS_START:
      return {
        ...state,
        loading: true,
        users: [],
        failedUsers: [],
        connectionFailedError: null
      }

    case AdminManageUsersActions.MANAGE_USERS_PROCEED:
      return {
        ...state,
        loading: false,
        failedUsers: action.payload,
        connectionFailedError: null
      }

    case AdminManageUsersActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        failedUsers: [],
        connectionFailedError: null
      }

    default:
      return state;
  }
}
