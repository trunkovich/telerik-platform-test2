import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AppState, authSelectors } from '../app-state/reducers/index';

@Injectable()
export class OnlySignedInUsers implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              stateSnapshot: RouterStateSnapshot) {
    return this.store.select(authSelectors.getAuthStatus)
      .do((authenticated) => {
        if (!authenticated) {
          this.router.navigate(['/', 'auth', 'login']);
        }
      });
  }
}
