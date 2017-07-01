import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as dialogs from 'ui/dialogs';

import * as authActions from '../actions/auth.actions';
import { AppState } from '../reducers/index';
import { RouterExtensions } from 'nativescript-angular';


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
export class RedirectsEffects {

  constructor(private actions$: Actions,
              private router: Router,
              private store: Store<AppState>,
              private routerExtentions: RouterExtensions) {
  }

  @Effect({dispatch: false})
  signIn$ = this.actions$
    .ofType(authActions.ActionTypes.SIGN_IN_SUCCESS)
    .do(() => this.routerExtentions.navigate(['/'], {clearHistory: true}));

  @Effect({dispatch: false})
  readUserFailed$ = this.actions$
    .ofType(authActions.ActionTypes.READ_USER_FAIL)
    .do(() => this.router.navigate(['/', 'auth', 'login']));

  @Effect({dispatch: false})
  logout$ = this.actions$
    .ofType(authActions.ActionTypes.LOGOUT)
    .do(() => this.router.navigate(['/', 'auth', 'login']));

  @Effect({dispatch: false})
  requestNewPassword$ = this.actions$
    .ofType(authActions.ActionTypes.REQUEST_NEW_PASSWORD_SUCCESS)
    .do(() => {
      dialogs.alert({
        title: "Success",
        message: "We have sent you an email with instructions",
        okButtonText: "OK"
      }).then(() => {
        this.routerExtentions.navigate(['/'], {clearHistory: true})
      });
    });
}
