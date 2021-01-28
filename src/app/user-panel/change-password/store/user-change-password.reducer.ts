import { User } from 'src/app/models/user.model';
import * as UserChangePasswordActions from './user-change-password.actions';

export interface State {
  responseMessage: string;
  loading: boolean;
}

const initialState: State = {
  responseMessage: null,
  loading: false,
};

export function userChangePasswordReducer(
  state = initialState,
  action: UserChangePasswordActions.UserChangePasswordActions
) {
  switch (action.type) {
    case UserChangePasswordActions.CHANGE_PASSWORD_START:
      return {
        responseMessage: null,
        loading: true,
      };

    case UserChangePasswordActions.PASSWORD_INTERACTION_COMPLETE:
      return {
        responseMessage: action.payload,
        loading: false
      };

    case UserChangePasswordActions.CLEAR_MESSAGE:
      return {
        responseMessage: null,
        loading: false
      };

    default:
      return state;
  }
}
