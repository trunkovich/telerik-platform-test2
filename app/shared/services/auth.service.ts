import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credentials, ForgotPasswordRequestData, ForgotPasswordResponse, SignInResponse, User } from '../app-state/models/auth.models';
import { ApiService } from './api.service';
import { APP_CONFIG } from '../configs/config';

import * as appSettings from 'application-settings';

@Injectable()
export class AuthService {

  constructor(private api: ApiService) {
  }

  signIn(credentials: Credentials): Observable<SignInResponse | string> {
    return this.api.request('post', 'api-token-auth/', credentials)
      .map((res: SignInResponse) => {
        if (res.token) {
          return res;
        } else {
          throw Error(<any>res);
        }
      });
  }

  requestNewPassword(data: ForgotPasswordRequestData): Observable<any> {
    return this.api.request('post', 'login/reset_password/', data)
      .map((res: ForgotPasswordResponse) => {
        if (res.result === 'success') {
          return true;
        } else {
          return Observable.throw(res.result);
        }
      });
  }

  loadUserFromLS(): Observable<User> {
    let user: User;
    let err: string;

    try {
      user = <User>JSON.parse(appSettings.getString(APP_CONFIG.LS_USER_KEY));
    } catch (error) {
      err = 'Get User Error: ' + error;
    }

    if (!user) {
      err = 'Not authenticated!';
    }

    if (err) {
      this.cleanAuthorisationData();
      return Observable.throw(err);
    } else {
      return Observable.of(user);
    }
  }

  loadTokenFromLS(): Observable<string> {
    let token: string;
    let err: string;

    try {
      token = appSettings.getString(APP_CONFIG.LS_TOKEN_KEY);
    } catch (error) {
      err = 'Get User Error: ' + error;
    }

    if (!token) {
      err = 'Not authenticated!';
    }

    if (err) {
      this.cleanAuthorisationData();
      return Observable.throw(err);
    } else {
      return Observable.of(token);
    }
  }

  saveAuthorisationData(signInResponse: SignInResponse) {
    if (!signInResponse || !signInResponse.token || !signInResponse.user) {
      return false;
    }
    let token = signInResponse.token;
    let user = signInResponse.user;

    try {
      let userJson = JSON.stringify(user);
      appSettings.setString(APP_CONFIG.LS_TOKEN_KEY, token);
      appSettings.setString(APP_CONFIG.LS_USER_KEY, userJson);
    } catch (error) {
      console.error(error);
    }
  }

  cleanAuthorisationData() {
    try {
      appSettings.remove(APP_CONFIG.LS_USER_KEY);
      appSettings.remove(APP_CONFIG.LS_TOKEN_KEY);
    } catch (error) {
      console.error(error);
    }
  }

}
