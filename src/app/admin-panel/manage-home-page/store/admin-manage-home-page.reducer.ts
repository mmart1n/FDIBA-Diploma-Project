import * as AdminManageHomePageActions from './admin-manage-home-page.actions';

export interface State {
  currentState: { id: number, working: boolean, text: string, active: boolean };
  statesTexts: { id: number, working: boolean, text: string, active: boolean }[];
  connectionFailedError: string;
  successMessage: string;
  loading: boolean;
}

const initialState: State = {
  currentState: { id: 1, working: false, text: "", active: true },
  statesTexts: [],
  connectionFailedError: null,
  successMessage: null,
  loading: true
};

export function adminManageHomePageReducer(
  state = initialState,
  action: AdminManageHomePageActions.AdminManageHomePageActions
) {
  switch (action.type) {
    case AdminManageHomePageActions.CONNECTION_ERROR:
      return {
        ...state,
        loading: false,
        connectionFailedError: action.payload,
      };
    case AdminManageHomePageActions.FETCH_SITE_STATE_START:
      return {
        ...state,
        loading: true,
        connectionFailedError: null
      };

    case AdminManageHomePageActions.FETCH_SITE_STATE_SUCCESS:
      return {
        ...state,
        currentState: action.payload,
        loading: false,
        connectionFailedError: null
      };

    case AdminManageHomePageActions.CHANGE_SITE_STATE_START:
      return {
        ...state,
        loading: true,
        connectionFailedError: null,
      }

    case AdminManageHomePageActions.FETCH_STATES_TEXTS_START:
      return {
        ...state,
        loading: true,
        statesTexts: [],
        connectionFailedError: null
      };

    case AdminManageHomePageActions.FETCH_STATES_TEXTS_SUCCESS:
      return {
        ...state,
        loading: false,
        statesTexts: action.payload,
        currentState: action.payload.find(x => x.active === true),
        connectionFailedError: null
      };

    case AdminManageHomePageActions.UPDATE_STATE_TEXT_START:
      return {
        ...state,
        loading: true,
      }

    case AdminManageHomePageActions.UPDATE_STATE_TEXT_PROCEED:
      return {
        ...state,
        loading: true,
        successMessage: action.payload
      }

    case AdminManageHomePageActions.CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        connectionFailedError: null,
        successMessage: null
      }

    default:
      return state;
  }
}
