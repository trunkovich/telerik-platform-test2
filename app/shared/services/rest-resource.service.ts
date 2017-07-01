import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

import { ApiService } from './api.service';

@Injectable()
export class RestResource {

  constructor(private api: ApiService) {
  }

  create(resourcePath, data) {
    return this.api.request('post', resourcePath, data);
  }

  read(resourcePath, id) {
    return this.api.request('get', `${resourcePath}/${id}`);
  }

  update(resourcePath, id, data) {
    return this.api.request('put', `${resourcePath}/${id}`, data);
  }

  delete(resourcePath, id) {
    return this.api.request('delete', `${resourcePath}/${id}`);
  }

  list(resourcePath, params) {
    let parameters = {
      max: params.max || null,
      offset: params.offset || null,
      sort: params.sort || null,
      order: params.order || null,
    };
    let filters = _.cloneDeep(params.filters);

    let urlParams: URLSearchParams = new URLSearchParams();
    _.toPairs(parameters).forEach(function (param) {
      urlParams.set(param[0], param[1]);
    });

    if (filters && Object.keys(filters).length) {
      urlParams.set('filters', JSON.stringify(filters));
    }

    return this.api.request('get', resourcePath, null, {search: urlParams});
  }
}
