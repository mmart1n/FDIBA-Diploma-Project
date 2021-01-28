import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  responseMessage: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  responseMessage: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.username,
        action.payload.userId,
        action.payload.firstName,
        action.payload.middleName,
        action.payload.lastName,
        action.payload.isAdmin,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        responseMessage: null,
        user,
        loading: false,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };

    case AuthActions.LOGIN_START:
      return {
        ...state,
        responseMessage: null,
        loading: true,
      };

    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        responseMessage: action.payload,
        loading: false,
      };

    case AuthActions.RESET_PASSWORD_START:
      return {
        ...state,
        responseMessage: null,
        loading: true
      };

    case AuthActions.PASSWORD_INTERACTION_COMPLETE:
      return {
        ...state,
        responseMessage: action.payload,
        loading: false
      };

    case AuthActions.CLEAR_MESSAGE:
      return {
        ...state,
        responseMessage: null,
      };

    default:
      return state;
  }
}
