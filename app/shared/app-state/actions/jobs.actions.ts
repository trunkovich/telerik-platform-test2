import { Action } from '@ngrx/store';
import { type } from '../../../utils/flux-utils';
import { JobsListResponse } from '../models/jobs.models';
import { FiltersMap, OrderingEnum } from '../reducers/jobs.reducer';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {

  // LOAD PAGE
  LOAD_PAGE: type('[Jobs] Load jobs page'),
  LOAD_PAGE_SUCCESS: type('[Jobs] Load jobs page success'),
  LOAD_PAGE_FAIL: type('[Jobs] Load jobs page failed'),

  // LOAD NEXT PAGE
  LOAD_NEXT_PAGE: type('[Jobs] Load next page'),
  LOAD_NEXT_PAGE_SUCCESS: type('[Jobs] Load next page success'),
  LOAD_NEXT_PAGE_FAIL: type('[Jobs] Load next page failed'),

  // REFRESH ALL PAGES
  REFRESH_ALL_PAGES: type('[Jobs] Refresh all pages'),
  REFRESH_ALL_PAGES_SUCCESS: type('[Jobs] Refresh all pages success'),
  REFRESH_ALL_PAGES_FAIL: type('[Jobs] Refresh all pages failed'),

  // OTHER
  SET_FILTERS: type('[Jobs] Set filters'),
  SET_ORDERING: type('[Jobs] Set ordering')
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

// LOAD PAGE ACTIONS
export class LoadPageAction implements Action {
  type = ActionTypes.LOAD_PAGE;
}
export class LoadPageSuccessAction implements Action {
  type = ActionTypes.LOAD_PAGE_SUCCESS;
  constructor(public payload: { page: number; response: JobsListResponse }) {}
}
export class LoadPageFailAction implements Action {
  type = ActionTypes.LOAD_PAGE_FAIL;
  constructor(public payload: string) {}
}

// LOAD NEXT PAGE ACTIONS
export class LoadNextPageAction implements Action {
  type = ActionTypes.LOAD_NEXT_PAGE;
}
export class LoadNextPageSuccessAction implements Action {
  type = ActionTypes.LOAD_NEXT_PAGE_SUCCESS;
  constructor(public payload: { page: number; response: JobsListResponse }) {}
}
export class LoadNextPageFailAction implements Action {
  type = ActionTypes.LOAD_NEXT_PAGE_FAIL;
  constructor(public payload: string) {}
}

// REFRESH ALL PAGES
export class RefreshAllPagesAction implements Action {
  type = ActionTypes.REFRESH_ALL_PAGES;
}
export class RefreshAllPagesSuccessAction implements Action {
  type = ActionTypes.REFRESH_ALL_PAGES_SUCCESS;
  constructor(public payload: Array<{ page: number; response: JobsListResponse }>) {}
}
export class RefreshAllPagesFailAction implements Action {
  type = ActionTypes.REFRESH_ALL_PAGES_FAIL;
  constructor(public payload: string) {}
}

// OTHER

export class SetFiltersAction implements Action {
  type = ActionTypes.SET_FILTERS;
  constructor(public payload: FiltersMap) {}
}
export class SetOrderingAction implements Action {
  type = ActionTypes.SET_ORDERING;
  constructor(public payload: OrderingEnum) {}
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  // LOAD PAGE
  = LoadPageAction
  | LoadPageSuccessAction
  | LoadPageFailAction

  // LOAD NEXT PAGE ACTIONS
  | LoadNextPageAction
  | LoadNextPageSuccessAction
  | LoadNextPageFailAction

  // REFRESH ALL PAGES
  | RefreshAllPagesAction
  | RefreshAllPagesSuccessAction
  | RefreshAllPagesFailAction

  // OTHER
  | SetFiltersAction
  | SetOrderingAction;
