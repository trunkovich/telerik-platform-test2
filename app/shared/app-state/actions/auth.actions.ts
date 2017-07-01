import { Action } from '@ngrx/store';
import { type } from '../../../utils/flux-utils';
import { Credentials, ForgotPasswordRequestData, SignInResponse, User } from '../models/auth.models';
import { FormErrors } from '../models/error-handling.models';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {

  // SIGN IN ACTIONS
  SIGN_IN: type('[Auth] SignIn'),
  SIGN_IN_SUCCESS: type('[Auth] SignIn success'),
  SIGN_IN_FAIL: type('[Auth] SignIn failed'),

  REQUEST_NEW_PASSWORD: type('[Auth] REQUEST_NEW_PASSWORD'),
  REQUEST_NEW_PASSWORD_SUCCESS: type('[Auth] REQUEST_NEW_PASSWORD success'),
  REQUEST_NEW_PASSWORD_FAIL: type('[Auth] REQUEST_NEW_PASSWORD failed'),

  // READ USER FROM LS
  READ_USER: type('[Auth] Read user'),
  READ_USER_SUCCESS: type('[Auth] Read user success'),
  READ_USER_FAIL: type('[Auth] Read user failed'),

  // READ TOKEN FROM LS
  READ_TOKEN: type('[Auth] Read token'),
  READ_TOKEN_SUCCESS: type('[Auth] Read token success'),
  READ_TOKEN_FAIL: type('[Auth] Read token failed'),

  // OTHERS
  LOGOUT: type('[Auth] Logout'),
  CLEAR_ERRORS: type('[Auth] CLEAR_ERRORS')
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

// SIGN IN ACTIONS
export class SignInAction implements Action {
  type = ActionTypes.SIGN_IN;

  constructor(public payload: Credentials) {
  }
}
export class SignInSuccessAction implements Action {
  type = ActionTypes.SIGN_IN_SUCCESS;

  constructor(public payload: SignInResponse) {
  }
}
export class SignInFailAction implements Action {
  type = ActionTypes.SIGN_IN_FAIL;

  constructor(public payload: FormErrors) {
  }
}

export class RequestNewPasswordAction implements Action {
  type = ActionTypes.REQUEST_NEW_PASSWORD;

  constructor(public payload: ForgotPasswordRequestData) {
  }
}
export class RequestNewPasswordSuccessAction implements Action {
  type = ActionTypes.REQUEST_NEW_PASSWORD_SUCCESS;
}
export class RequestNewPasswordFailAction implements Action {
  type = ActionTypes.REQUEST_NEW_PASSWORD_FAIL;

  constructor(public payload: string) {
  }
}

// READ USER FROM LS
export class ReadUserAction implements Action {
  type = ActionTypes.READ_USER;

  constructor() {
  }
}
export class ReadUserSuccessAction implements Action {
  type = ActionTypes.READ_USER_SUCCESS;

  constructor(public payload: User) {
  }
}
export class ReadUserFailAction implements Action {
  type = ActionTypes.READ_USER_FAIL;

  constructor(public payload: any) {
  }
}

// READ TOKEN FROM LS
export class ReadTokenAction implements Action {
  type = ActionTypes.READ_TOKEN;

  constructor() {
  }
}
export class ReadTokenSuccessAction implements Action {
  type = ActionTypes.READ_TOKEN_SUCCESS;

  constructor(public payload: string) {
  }
}
export class ReadTokenFailAction implements Action {
  type = ActionTypes.READ_TOKEN_FAIL;

  constructor(public payload: any) {
  }
}


// OTHERS
export class LogoutAction implements Action {
  type = ActionTypes.LOGOUT;
}
export class ClearErrorsAction implements Action {
  type = ActionTypes.CLEAR_ERRORS;
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  // SIGN IN
  = SignInAction
  | SignInSuccessAction
  | SignInFailAction

  | RequestNewPasswordAction
  | RequestNewPasswordSuccessAction
  | RequestNewPasswordFailAction

  // READ USER FROM LS
  | ReadUserAction
  | ReadUserSuccessAction
  | ReadUserFailAction

  // READ TOKEN FROM LS
  | ReadTokenAction
  | ReadTokenSuccessAction
  | ReadTokenFailAction


  //  OTHERS
  | ClearErrorsAction
  | LogoutAction;
