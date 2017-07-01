import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as authActions from '../actions/auth.actions';
import { Credentials, ForgotPasswordRequestData, SignInResponse } from '../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';


/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService, private apiService: ApiService) {
  }

  @Effect()
  getUserFromLS$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.READ_USER)
    .startWith(new authActions.ReadUserAction())
    .switchMap(() => {
      return this.authService.loadUserFromLS()
        .map((user) => new authActions.ReadUserSuccessAction(user))
        .catch(error => Observable.of(new authActions.ReadUserFailAction(error)));
    });

  @Effect()
  getTokenFromLS$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.READ_TOKEN)
    .startWith(new authActions.ReadTokenAction())
    .switchMap(() => {
      return this.authService.loadTokenFromLS()
        .map((token: string) => new authActions.ReadTokenSuccessAction(token))
        .catch(error => Observable.of(new authActions.ReadTokenFailAction(error)));
    });

  @Effect({dispatch: false})
  logout$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.LOGOUT)
    .do(() => {
      this.authService.cleanAuthorisationData();
    });

  @Effect()
  signIn$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.SIGN_IN)
    .map(toPayload)
    .switchMap((credentials: Credentials) => {
      return this.authService.signIn(credentials)
        .map((signInResponse: SignInResponse) => new authActions.SignInSuccessAction(signInResponse))
        .catch(error => {
          if (error.status === 400 && error.json) {
            let data = error.json();
            return Observable.of(new authActions.SignInFailAction(data));
          } else {
            console.error(error);
            return Observable.of(new authActions.SignInFailAction({}));
          }
        });
    });

  @Effect({dispatch: false})
  storeUserAfterSuccessSignIn$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.SIGN_IN_SUCCESS)
    .map(toPayload)
    .do((signInResponse: SignInResponse) => this.authService.saveAuthorisationData(signInResponse))
    .do((signInResponse: SignInResponse) => this.apiService.setToken(signInResponse.token));

  @Effect({dispatch: false})
  setToken$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.SIGN_IN_SUCCESS, authActions.ActionTypes.READ_TOKEN_SUCCESS)
    .map(toPayload)
    .do((result: SignInResponse | string) => this.apiService.setToken(typeof result === 'string' ? result : result.token));

  @Effect()
  requestPasswordReset$: Observable<Action> = this.actions$
    .ofType(authActions.ActionTypes.REQUEST_NEW_PASSWORD)
    .map(toPayload)
    .switchMap((data: ForgotPasswordRequestData) => {
      return this.authService.requestNewPassword(data)
        .map(() => new authActions.RequestNewPasswordSuccessAction())
        .catch(error => Observable.of(new authActions.RequestNewPasswordFailAction('User with such email or phone doesn\'t exist')));
    });

}
