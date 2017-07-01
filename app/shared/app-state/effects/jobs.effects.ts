import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

import * as jobActions from '../actions/jobs.actions';
import { AppState, jobsSelectors } from '../reducers/index';
import { JobsService } from '../../services/jobs.service';
import { JobsListResponse } from '../models/jobs.models';


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
export class JobsEffects {
  constructor(private actions$: Actions, private store: Store<AppState>, private jobsService: JobsService) {
  }

  @Effect()
  refreshAllPages: Observable<Action> = this.actions$
    .ofType(jobActions.ActionTypes.REFRESH_ALL_PAGES)
    .withLatestFrom(
      this.store.select(jobsSelectors.getPage),
      this.store.select(jobsSelectors.getAllFilters)
    )
    .switchMap(([_, nextPage, filters]) => {
      let Observables = [];
      for (let page = 1; page <= nextPage; page++) {
        Observables.push(
          this.jobsService.listJobs(page, filters)
            .map((response: JobsListResponse) => { return { response, page }})
            .retry(2)
            .catch(error => Observable.of(new jobActions.RefreshAllPagesFailAction(error)))
        )
      }
      return Observable.zip(...Observables)
        .map((data: Array<{ page: number; response: JobsListResponse }>) => {
          return new jobActions.RefreshAllPagesSuccessAction(data);
        });
    });

  @Effect()
  loadPage$: Observable<Action> = this.actions$
    .ofType(jobActions.ActionTypes.LOAD_PAGE, jobActions.ActionTypes.LOAD_NEXT_PAGE)
    .withLatestFrom(
      this.store.select(jobsSelectors.getPage),
      this.store.select(jobsSelectors.getAllFilters)
    )
    .switchMap(([_, page, filters]) => {
      return this.jobsService.listJobs(page, filters)
        .map((response: JobsListResponse) => new jobActions.LoadPageSuccessAction({response, page}))
        .catch(error => Observable.of(new jobActions.LoadPageFailAction(error)));
    });
}
