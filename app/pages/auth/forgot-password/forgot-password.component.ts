import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState, authSelectors } from '../../../shared/app-state/reducers/index';
import { markInvalidFieldsAsTouched } from '../../../utils/form-utils';
import { ForgotPasswordRequestData } from '../../../shared/app-state/models/auth.models';
import { ClearErrorsAction, RequestNewPasswordAction } from '../../../shared/app-state/actions/auth.actions';

const EmailOrPhonePattern = /^([a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-zA-Z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?)|[7-9][0-9]{8}$/;

@Component({
  moduleId: module.id,
  selector: 'forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password-common.component.css', 'forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  loading$: Observable<boolean>;
  error: string;

  sub: Subscription;
  sub2: Subscription;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearErrorsAction());
    this.forgotPasswordForm = this.fb.group({
      user: ['6934257154', [Validators.required, Validators.pattern(EmailOrPhonePattern)]]
    });
    this.loading$ = this.store.select(authSelectors.getLoadingState);
    this.sub = this.store.select(authSelectors.getError)
      .subscribe(error => {
        this.error = error;
      });

    this.sub2 = this.forgotPasswordForm.valueChanges
      .subscribe(data => {
        this.error = '';
      })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  requestNewPassword(form: FormGroup) {
    if (form.invalid) {
      markInvalidFieldsAsTouched(form);
    } else {
      let data: ForgotPasswordRequestData = {};
      if (form.value.user.match(/^[0-9]+$/) != null) {
        data.phone = form.value.user;
      } else {
        data.email = form.value.user;
      }
      this.store.dispatch(new RequestNewPasswordAction(data));
    }
  }
}
