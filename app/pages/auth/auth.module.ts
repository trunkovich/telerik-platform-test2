import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth.routing';
import { NativeScriptFormsModule } from 'nativescript-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthModule {
}
