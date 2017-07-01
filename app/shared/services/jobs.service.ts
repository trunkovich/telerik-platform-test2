import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as _ from 'lodash';

import { ApiService } from './api.service';

@Injectable()
export class JobsService {

  constructor(private api: ApiService) {}

  listJobs(page, filters) {
    let parameters = {page};
    
    if (filters) {
      _.each(_.keys(filters), (key) => {
        parameters[key] = filters[key]
      });
    }

    let urlParams: URLSearchParams = new URLSearchParams();
    _.toPairs(parameters).forEach(function (param) {
      urlParams.set(param[0], param[1]);
    });

    return this.api.request('get', 'job/', null, {search: urlParams});
  }
}
