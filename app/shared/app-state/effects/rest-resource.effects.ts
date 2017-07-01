// import { Injectable } from '@angular/core';
// import { Actions, Effect, toPayload } from '@ngrx/effects';
// import { Action, Store } from '@ngrx/store';
// import { Observable } from 'rxjs/Observable';
// import { AppState, restSelectors } from '../reducers/index';
//
// import * as restActions from '../actions/rest-resource.actions';
// import { RestResource } from '../../services/rest-resource.service';
// import { ListResponse, Resource } from '../models/rest-resource.models';
//
//
// /**
//  * Effects offer a way to isolate and easily test side-effects within your
//  * application. StateUpdates is an observable of the latest state and
//  * dispatched action. The `toPayload` helper function returns just
//  * the payload of the currently dispatched action, useful in
//  * instances where the current state is not necessary.
//  *
//  * If you are unfamiliar with the operators being used in these examples, please
//  * check out the sources below:
//  *
//  * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
//  * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
//  */
//
// @Injectable()
// export class RestResourcesEffects {
//   constructor(private actions$: Actions, private store: Store<AppState>, private rest: RestResource) {
//   }
//
//   @Effect()
//   listResource$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.LIST_RESOURCE)
//     .map(toPayload)
//     .switchMap(({resourcePath, withoutCache}) => {
//       return Observable.of({resourcePath, withoutCache})
//         .withLatestFrom(
//           this.store.select(restSelectors.getListParams(resourcePath)),
//           this.store.select(restSelectors.getCacheAvailability(resourcePath))
//         )
//     })
//     .mergeMap(([{resourcePath, withoutCache}, params, isCached]) => {
//       if (isCached && !withoutCache) {
//         return Observable.of(new restActions.ListResourceFromCacheAction());
//       } else {
//         return this.rest.list(resourcePath, params)
//           .map((response: ListResponse) => new restActions.ListResourceSuccessAction({response, resourcePath}))
//           .catch(error => Observable.of(new restActions.ListResourceFailAction(error)));
//       }
//     });
//
//   @Effect()
//   createResource$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.CREATE_RESOURCE)
//     .map(toPayload)
//     .switchMap(({resourcePath, data}) => {
//       return this.rest.create(resourcePath, data)
//         .map((response: Resource) => new restActions.CreateResourceSuccessAction({resourcePath, response}))
//         .catch(error => Observable.of(new restActions.CreateResourceFailAction(error)));
//     });
//
//   @Effect()
//   deleteResource$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.DELETE_RESOURCE)
//     .map(toPayload)
//     .mergeMap(({resourcePath, id}) => {
//       return this.rest.delete(resourcePath, id)
//         .map((response: any) => new restActions.DeleteResourceSuccessAction({resourcePath, response}))
//         .catch(error => Observable.of(new restActions.DeleteResourceFailAction(error)));
//     });
//
//   @Effect()
//   updateResource$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.UPDATE_RESOURCE)
//     .map(toPayload)
//     .switchMap(({resourcePath, id, data}) => {
//       return this.rest.update(resourcePath, id, data)
//         .map((response: any) => new restActions.UpdateResourceSuccessAction({resourcePath, response}))
//         .catch(error => Observable.of(new restActions.UpdateResourceFailAction(error)));
//     });
//
//   @Effect()
//   readResource$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.READ_RESOURCE)
//     .map(toPayload)
//     .switchMap(({resourcePath, id}) => {
//       return this.rest.read(resourcePath, id)
//         .map((response: any) => new restActions.ReadResourceSuccessAction({resourcePath, response}))
//         .catch(error => Observable.of(new restActions.ReadResourceFailAction(error)));
//     });
//
//   @Effect()
//   reloadList$: Observable<Action> = this.actions$
//     .ofType(
//       restActions.ActionTypes.CREATE_RESOURCE_SUCCESS,
//       restActions.ActionTypes.DELETE_RESOURCE_SUCCESS
//     )
//     .map(toPayload)
//     .map(({resourcePath}) => new restActions.ListResourceAction({resourcePath, withoutCache: true}));
//
//
//   @Effect()
//   readFromResponse$: Observable<Action> = this.actions$
//     .ofType(restActions.ActionTypes.UPDATE_RESOURCE_SUCCESS)
//     .map(toPayload)
//     .map((payload) => new restActions.ReadResourceSuccessAction(payload));
//
// }
