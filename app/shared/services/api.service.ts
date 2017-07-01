import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../app-state/reducers/index';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../configs/config';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { LogoutAction } from '../app-state/actions/auth.actions';

@Injectable()
export class ApiService {
  public defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ClientPlatform': (isAndroid ? 'android' : (isIOS ? 'ios' : '')) + '-' + APP_CONFIG.APP_VERSION
  });
  public defaultOptions = new RequestOptions({headers: this.defaultHeaders, withCredentials: true});
  private token = '';

  constructor(private $http: Http, private store: Store<AppState>) {
  }

  setToken(token: string) {
    this.token = token;
    if (this.defaultHeaders.has('Authorization')) {
      this.defaultHeaders.set('Authorization', `JWT ${this.token}`);
    } else {
      this.defaultHeaders.append('Authorization', `JWT ${this.token}`);
    }
    this.defaultOptions.headers = this.defaultHeaders;
  }

  request(method, url, data?: any, opts = {}) {
    let options: RequestOptions = this.defaultOptions.merge(opts);
    options.method = method;
    if (data) {
      options.body = data;
    }
    return this.$http.request(`${APP_CONFIG.API_URL}${url}`, options)
      .map(response => response.json())
      .catch((response): Observable<any> => {
        if (response.status === 401) {
          this.store.dispatch(new LogoutAction());
          return Observable.empty();
        }
        throw response;
      });
  }
}