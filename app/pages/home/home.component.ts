import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, authSelectors } from '../../shared/app-state/reducers/index';
import { LogoutAction, SignInAction } from '../../shared/app-state/actions/auth.actions';

@Component({
  selector: 'home',
  template: `
    <ActionBar title="Home" class="action-bar"></ActionBar>
    <StackLayout class="form">
      <Button class="btn btn-active" text="Logout" (tap)="logout()" *ngIf="authorised$ | async"></Button>
      <Button [nsRouterLink]="['/', 'auth', 'login']" text="Go to Login"></Button>
      <Button [nsRouterLink]="['/', 'jobs']" text="Go to Jobs"></Button>
    </StackLayout>
  `
})
export class HomeComponent implements OnInit {
  authorised$: Observable<boolean>;

  constructor(private store: Store<AppState>) {

  }

  ngOnInit() {
    this.authorised$ = this.store.select(authSelectors.getAuthStatus);

  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }
}
