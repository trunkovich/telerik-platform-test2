import { Action } from '@ngrx/store';
import { type } from '../../../utils/flux-utils';
import { ListParams, ListResponse, Resource } from '../models/rest-resource.models';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {

  // LIST ACTIONS
  LIST_RESOURCE: type('[RR] List restful resource'),
  LIST_RESOURCE_SUCCESS: type('[RR] List restful resource success'),
  LIST_RESOURCE_FROM_CACHE: type('[RR] List restful resource from cache'),
  LIST_RESOURCE_FAIL: type('[RR] List restful resource failed'),

  // SET PARAMS
  SET_RESOURCE_PARAMS: type('[RR] Set params for list response'),
  SET_RESOURCE_OFFSET: type('[RR] Set offset for list response'),

  // READ ACTIONS
  READ_RESOURCE: type('[RR] Read restful resource'),
  READ_RESOURCE_SUCCESS: type('[RR] Read restful resource success'),
  READ_RESOURCE_FAIL: type('[RR] Read restful resource failed'),

  // UPDATE ACTIONS
  UPDATE_RESOURCE: type('[RR] Update restful resource'),
  UPDATE_RESOURCE_SUCCESS: type('[RR] Update restful resource success'),
  UPDATE_RESOURCE_FAIL: type('[RR] Update restful resource failed'),

  // CREATE ACTIONS
  CREATE_RESOURCE: type('[RR] Create restful resource'),
  CREATE_RESOURCE_SUCCESS: type('[RR] Create restful resource success'),
  CREATE_RESOURCE_FAIL: type('[RR] Create restful resource failed'),

  // DELETE ACTIONS
  DELETE_RESOURCE: type('[RR] Delete restful resource'),
  DELETE_RESOURCE_SUCCESS: type('[RR] Delete restful resource success'),
  DELETE_RESOURCE_FAIL: type('[RR] Delete restful resource failed'),

  // OTHER
  CLEAR_ERRORS: type('[RR] Clear restful errors'),


};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

// LIST ACTIONS
export class ListResourceAction implements Action {
  type = ActionTypes.LIST_RESOURCE;

  constructor(public payload: { resourcePath: string; withoutCache?: boolean; }) {
  }
}
export class ListResourceSuccessAction implements Action {
  type = ActionTypes.LIST_RESOURCE_SUCCESS;

  constructor(public payload: { response: ListResponse; resourcePath: string; }) {
  }
}
export class ListResourceFromCacheAction implements Action {
  type = ActionTypes.LIST_RESOURCE_FROM_CACHE;
}
export class ListResourceFailAction implements Action {
  type = ActionTypes.LIST_RESOURCE_FAIL;

  constructor(public payload: string) {
  }
}

// SET PARAMS
export class SetResourceParamsAction implements Action {
  type = ActionTypes.SET_RESOURCE_PARAMS;

  constructor(public payload: { resourcePath: string; params: ListParams; }) {
  }
}
export class SetResourceOffsetAction implements Action {
  type = ActionTypes.SET_RESOURCE_OFFSET;

  constructor(public payload: { resourcePath: string; offset: number; }) {
  }
}


// READ ACTIONS
export class ReadResourceAction implements Action {
  type = ActionTypes.READ_RESOURCE;

  constructor(public payload: { id: number; resourcePath: string; }) {
  }
}
export class ReadResourceSuccessAction implements Action {
  type = ActionTypes.READ_RESOURCE_SUCCESS;

  constructor(public payload: { response: Resource; resourcePath: string; }) {
  }
}
export class ReadResourceFailAction implements Action {
  type = ActionTypes.READ_RESOURCE_FAIL;

  constructor(public payload: string) {
  }
}

// UPDATE ACTIONS
export class UpdateResourceAction implements Action {
  type = ActionTypes.UPDATE_RESOURCE;

  constructor(public payload: { id: number; data: any; resourcePath: string; }) {
  }
}
export class UpdateResourceSuccessAction implements Action {
  type = ActionTypes.UPDATE_RESOURCE_SUCCESS;

  constructor(public payload: { response: Resource; resourcePath: string; }) {
  }
}
export class UpdateResourceFailAction implements Action {
  type = ActionTypes.UPDATE_RESOURCE_FAIL;

  constructor(public payload: string) {
  }
}

// CREATE ACTIONS
export class CreateResourceAction implements Action {
  type = ActionTypes.CREATE_RESOURCE;

  constructor(public payload: { data: any; resourcePath: string; }) {
  }
}
export class CreateResourceSuccessAction implements Action {
  type = ActionTypes.CREATE_RESOURCE_SUCCESS;

  constructor(public payload: { response: Resource; resourcePath: string; }) {
  }
}
export class CreateResourceFailAction implements Action {
  type = ActionTypes.CREATE_RESOURCE_FAIL;

  constructor(public payload: string) {
  }
}

// DELETE ACTIONS
export class DeleteResourceAction implements Action {
  type = ActionTypes.DELETE_RESOURCE;

  constructor(public payload: { id: number; resourcePath: string; }) {
  }
}
export class DeleteResourceSuccessAction implements Action {
  type = ActionTypes.DELETE_RESOURCE_SUCCESS;

  constructor(public payload: { response: any; resourcePath: string; }) {
  }
}
export class DeleteResourceFailAction implements Action {
  type = ActionTypes.DELETE_RESOURCE_FAIL;

  constructor(public payload: string) {
  }
}

// OTHER
export class ClearErrorsAction implements Action {
  type = ActionTypes.CLEAR_ERRORS;
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  // SIGN IN
  = ListResourceAction
  | ListResourceSuccessAction
  | ListResourceFailAction
  | ListResourceFromCacheAction

  // READ ACTIONS
  | ReadResourceAction
  | ReadResourceSuccessAction
  | ReadResourceFailAction

  // UPDATE ACTIONS
  | UpdateResourceAction
  | UpdateResourceSuccessAction
  | UpdateResourceFailAction

  // CREATE ACTIONS
  | CreateResourceAction
  | CreateResourceSuccessAction
  | CreateResourceFailAction

  // DELETE ACTIONS
  | DeleteResourceAction
  | DeleteResourceSuccessAction
  | DeleteResourceFailAction

  | SetResourceParamsAction
  | SetResourceOffsetAction
  | ClearErrorsAction;
