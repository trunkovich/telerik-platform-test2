import * as _ from 'lodash';

import * as authActions from '../actions/auth.actions';
import { FormErrors } from '../models/error-handling.models';

export interface AuthState {
  errorMsg: string | null;
  loading: boolean;
  authenticated: boolean;
  formErrors: FormErrors;
}

const initialAuthState = {
  errorMsg: null,
  loading: false,
  authenticated: false,
  formErrors: null
};

export function authReducer(state: AuthState = initialAuthState, action: authActions.Actions): AuthState {
  switch (action.type) {
    case authActions.ActionTypes.READ_USER_FAIL:
    case authActions.ActionTypes.LOGOUT: {
      return _.cloneDeep(initialAuthState);
    }
    case authActions.ActionTypes.SIGN_IN:
    case authActions.ActionTypes.REQUEST_NEW_PASSWORD: {
      return setLoadingHanlder(state, true);
    }
    case authActions.ActionTypes.CLEAR_ERRORS:
    case authActions.ActionTypes.REQUEST_NEW_PASSWORD_SUCCESS: {
      return setLoadingHanlder(state, false);
    }
    case authActions.ActionTypes.SIGN_IN_FAIL:
    case authActions.ActionTypes.REQUEST_NEW_PASSWORD_FAIL: {
      return setErrorMsg(state, (action as authActions.SignInFailAction | authActions.RequestNewPasswordFailAction));
    }
    case authActions.ActionTypes.READ_USER_SUCCESS:
    case authActions.ActionTypes.SIGN_IN_SUCCESS: {
      return signInSuccessHandler(state);
    }
    default: {
      return state;
    }
  }
}

/* ------------------------------------------------------------------ */
/* -------------------------REDUCER HANDLERS------------------------- */
/* ------------------------------------------------------------------ */
function setLoadingHanlder(state: AuthState, loadingState: boolean): AuthState {
  let newState = _.cloneDeep(state);
  newState.loading = loadingState;
  newState.errorMsg = null;
  newState.formErrors = null;
  return newState;
}

function setErrorMsg(state: AuthState, action: authActions.SignInFailAction | authActions.RequestNewPasswordFailAction): AuthState {
  let newState = _.cloneDeep(state);
  newState.loading = false;
  if (typeof action.payload === 'string') {
    newState.errorMsg = action.payload;
  } else if (typeof action.payload === 'object') {
    if (Object.keys(action.payload).length === 1 && action.payload.non_field_errors) {
      newState.errorMsg = action.payload.non_field_errors;
    } else {
      newState.formErrors = action.payload;
    }
  }
  return newState;
}

function signInSuccessHandler(state: AuthState): AuthState {
  let newState = _.cloneDeep(state);

  newState.authenticated = true;
  newState.errorMsg = null;
  newState.loading = false;

  return newState;
}

/* ------------------------------------------------------------------- */
/* -----------------------------SELECTORS----------------------------- */
/* ------------------------------------------------------------------- */
export const getAuthenticated = (state: AuthState) => state.authenticated;
export const getErrorMsg = (state: AuthState) => state.errorMsg;
export const getLoading = (state: AuthState) => state.loading;
