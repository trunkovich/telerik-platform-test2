import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AppState, authSelectors } from '../../../shared/app-state/reducers/index';
import { markInvalidFieldsAsTouched } from '../../../utils/form-utils';
import { Credentials } from '../../../shared/app-state/models/auth.models';
import { ClearErrorsAction, SignInAction } from '../../../shared/app-state/actions/auth.actions';


@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login-common.component.css', 'login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearErrorsAction());
    this.loginForm = this.fb.group({
      phone: ['6934257154', Validators.required],
      password: ['qwerty', Validators.required],
    });
    this.loading$ = this.store.select(authSelectors.getLoadingState);
    this.error$ = this.store.select(authSelectors.getError);
  }

  login(form: FormGroup) {
    if (form.invalid) {
      markInvalidFieldsAsTouched(form);
    } else {
      let credentials: Credentials = {
        phone: form.value.phone,
        password: form.value.password
      };
      this.store.dispatch(new SignInAction(credentials));
    }
  }
}
