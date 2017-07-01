import * as _ from 'lodash';
import { createSelector } from 'reselect';

import * as restfulActions from '../actions/rest-resource.actions';
import { ListPages, ListParams, Resource, ResourceMap, ResourceState, ResourceStateMap } from '../models/rest-resource.models';
import { Response } from '@angular/http';
import { FormErrorsVM } from '../models/error.models';

export const initialResourceState: ResourceState = {
  resources: {},
  list: {
    totalCount: 0,
    params: {
      max: 10,
      offset: 0,
      sort: null,
      order: null,
      filters: {}
    },
    currentPageIndex: 1,
    pages: {},
  }
};

export interface RestfulState {
  resourceStates: ResourceStateMap;
  errorMsg: string | null;
  formErrors: FormErrorsVM;
  error404: boolean;
  loading: boolean;
}

const initialRestfulState = {
  resourceStates: {},
  errorMsg: null,
  formErrors: {},
  error404: false,
  loading: false,
};

export function restResourceReducer(state: RestfulState = initialRestfulState, action: restfulActions.Actions): RestfulState {
  switch (action.type) {
    case restfulActions.ActionTypes.LIST_RESOURCE: {
      return initResourceHandler(state, (action as restfulActions.ListResourceAction));
    }
    case restfulActions.ActionTypes.CREATE_RESOURCE:
    case restfulActions.ActionTypes.READ_RESOURCE:
    case restfulActions.ActionTypes.UPDATE_RESOURCE:
    case restfulActions.ActionTypes.DELETE_RESOURCE: {
      return setLoadingHanlder(state, true);
    }
    case restfulActions.ActionTypes.CREATE_RESOURCE_SUCCESS:
    case restfulActions.ActionTypes.UPDATE_RESOURCE_SUCCESS:
    case restfulActions.ActionTypes.DELETE_RESOURCE_SUCCESS:
    case restfulActions.ActionTypes.LIST_RESOURCE_FROM_CACHE: {
      return setLoadingHanlder(state, false);
    }
    case restfulActions.ActionTypes.LIST_RESOURCE_FAIL:
    case restfulActions.ActionTypes.CREATE_RESOURCE_FAIL:
    case restfulActions.ActionTypes.READ_RESOURCE_FAIL:
    case restfulActions.ActionTypes.UPDATE_RESOURCE_FAIL:
    case restfulActions.ActionTypes.DELETE_RESOURCE_FAIL: {
      return setErrorMsg(state, (action as restfulActions.ListResourceFailAction |
        restfulActions.CreateResourceFailAction |
        restfulActions.ReadResourceFailAction |
        restfulActions.UpdateResourceFailAction |
        restfulActions.DeleteResourceFailAction));
    }
    case restfulActions.ActionTypes.LIST_RESOURCE_SUCCESS: {
      return listResourceHandler(state, (action as restfulActions.ListResourceSuccessAction));
    }
    case restfulActions.ActionTypes.READ_RESOURCE_SUCCESS: {
      return readResourceHandler(state, (action as restfulActions.ReadResourceSuccessAction));
    }
    case restfulActions.ActionTypes.SET_RESOURCE_PARAMS: {
      return setListParamsHandler(state, (action as restfulActions.SetResourceParamsAction));
    }
    case restfulActions.ActionTypes.SET_RESOURCE_OFFSET: {
      return setOffsetParamHandler(state, (action as restfulActions.SetResourceOffsetAction));
    }
    case restfulActions.ActionTypes.CLEAR_ERRORS: {
      return clearErrorsHandler(state);
    }
    default: {
      return state;
    }
  }
}

/* ------------------------------------------------------------------ */
/* -------------------------REDUCER HANDLERS------------------------- */
/* ------------------------------------------------------------------ */
function setLoadingHanlder(state: RestfulState, loadingState: boolean): RestfulState {
  let newState = _.clone(state);
  newState.loading = loadingState;
  newState.errorMsg = null;
  return newState;
}
function clearErrorsHandler(state: RestfulState): RestfulState {
  let newState = _.clone(state);
  newState.errorMsg = null;
  newState.error404 = false;
  return newState;
}
function setErrorMsg(state: RestfulState, action: restfulActions.ListResourceFailAction |
  restfulActions.CreateResourceFailAction |
  restfulActions.ReadResourceFailAction |
  restfulActions.UpdateResourceFailAction |
  restfulActions.DeleteResourceFailAction): RestfulState {
  let newState = _.clone(state);
  if (typeof action.payload === 'object' && (action.payload as any).status) {
    let response = (action.payload as any);
    if (response.status === 404) {
      newState.error404 = true;
    }
  }
  newState.loading = false;
  if (typeof action.payload === 'string') {
    newState.errorMsg = action.payload;
  } else {
    // newState.formErrors = tryToParseFormErrorsFromResponse(action.payload as Response)
  }
  return newState;
}

function initResourceHandler(state: RestfulState, action: restfulActions.ListResourceAction) {
  let newState = _.clone(state);

  if (!newState.resourceStates[action.payload.resourcePath]) {
    newState.resourceStates = _.clone(newState.resourceStates);
    newState.resourceStates[action.payload.resourcePath] = _.cloneDeep(initialResourceState);
  }

  newState.loading = true;
  newState.errorMsg = null;
  return newState;
}

function listResourceHandler(state: RestfulState, action: restfulActions.ListResourceSuccessAction) {
  let newState = _.clone(state);
  newState.resourceStates = _.clone(newState.resourceStates);
  let responseData = action.payload.response;
  let resourceState = _.cloneDeep(newState.resourceStates[action.payload.resourcePath] || initialResourceState);
  let resources = resourceState.resources;
  let resourceList = resourceState.list;
  let pageIndex = (resourceList.params.offset / resourceList.params.max) + 1;

  resourceList.pages[pageIndex] = [];
  _.each<Resource>(responseData.list, (resource) => {
    resources[resource.id] = resource;
    resourceList.pages[pageIndex].push(resource.id);
  });
  resourceList.currentPageIndex = pageIndex;
  resourceList.totalCount = responseData.count;

  newState.resourceStates[action.payload.resourcePath] = resourceState;
  newState.loading = false;
  return newState;
}

function readResourceHandler(state: RestfulState, action: restfulActions.ReadResourceSuccessAction) {
  let newState = _.clone(state);
  newState.resourceStates = _.clone(newState.resourceStates);
  let response = action.payload.response;
  let resourceState = _.cloneDeep(newState.resourceStates[action.payload.resourcePath] || initialResourceState);
  if (!resourceState.resources[response.id]) {
    resourceState.resources[response.id] = _.cloneDeep(response);
  }

  resourceState.resources[response.id].detail = response;

  newState.resourceStates[action.payload.resourcePath] = resourceState;
  newState.loading = false;
  return newState;
}

function setListParamsHandler(state: RestfulState, action: restfulActions.SetResourceParamsAction) {
  let newState = _.clone(state);
  newState.resourceStates = _.clone(newState.resourceStates);
  let resourceState = _.cloneDeep(initialResourceState);
  let resourceList = _.clone(resourceState.list);
  resourceList.params = _.merge({}, resourceList.params, _.cloneDeep(action.payload.params));
  resourceList.params.filters = _.cloneDeep(action.payload.params.filters);

  resourceState.list = resourceList;
  newState.resourceStates[action.payload.resourcePath] = resourceState;
  return newState;
}

function setOffsetParamHandler(state: RestfulState, action: restfulActions.SetResourceOffsetAction) {
  let newState = _.clone(state);
  newState.resourceStates = _.clone(newState.resourceStates);
  let resourceState = _.clone(newState.resourceStates[action.payload.resourcePath]);
  let resourceList = _.cloneDeep(resourceState.list);
  resourceList.params.offset = action.payload.offset;

  resourceState.list = resourceList;
  newState.resourceStates[action.payload.resourcePath] = resourceState;
  return newState;
}

/* ------------------------------------------------------------------- */
/* -----------------------------SELECTORS----------------------------- */
/* ------------------------------------------------------------------- */
export const getErrorMsg = (state: RestfulState) => state.errorMsg;
export const getFormErrors = (state: RestfulState) => state.formErrors;
export const getLoading = (state: RestfulState) => state.loading;
export const getError404 = (state: RestfulState) => state.error404;
export const getResourceStates = (state: RestfulState) => state.resourceStates;

export const getResourceStateByPath = resourcePath => {
  return createSelector(
    getResourceStates,
    (resourceStates: ResourceStateMap): ResourceState => resourceStates[resourcePath] || _.cloneDeep(initialResourceState)
  );
};

export const getAllResourceByPath = resourcePath => {
  return createSelector(
    getResourceStateByPath(resourcePath),
    (resourceState: ResourceState): Array<Resource | null> => {
      let list: Array<Resource | null> = [];
      let resources: ResourceMap = resourceState.resources;
      let params: ListParams = resourceState.list.params;
      let pages: ListPages = resourceState.list.pages;
      let total: number = resourceState.list.totalCount;

      if (!total) {
        return [];
      }

      for (let i = 1; i <= (total / params.max) + 1; i++) {
        if (!pages[i]) {
          list = _.concat(list, _.fill(Array(params.max), null));
        } else {
          list = _.concat(list, _.map(pages[i], (id) => resources[id] || null));
        }
      }

      return list;
    }
  )
};

export const getListParams = resourcePath => {
  return createSelector(
    getResourceStateByPath(resourcePath),
    (resourceState: ResourceState): ListParams => {
      if (resourceState) {
        return resourceState.list.params;
      } else {
        return _.cloneDeep(initialResourceState).list.params;
      }
    }
  );
};

export const getTotalCount = resourcePath => {
  return createSelector(
    getResourceStateByPath(resourcePath),
    (resourceState: ResourceState): number => {
      if (resourceState) {
        return resourceState.list.totalCount;
      } else {
        return _.cloneDeep(initialResourceState).list.totalCount;
      }
    }
  );
};

export const getCacheAvailability = resourcePath => {
  return createSelector(
    getResourceStateByPath(resourcePath),
    (resourceState: ResourceState): boolean => {
      let page = resourceState.list.params.offset / resourceState.list.params.max + 1;
      return !!resourceState.list.pages[page];
    }
  );
};

export const getResourceDetailById = (resourcePath, id) => {
  return createSelector(
    getResourceStateByPath(resourcePath),
    (resourceState: ResourceState): Resource | null => {
      if (!resourceState ||
        !resourceState.resources ||
        !resourceState.resources[id] ||
        !resourceState.resources[id].detail) {
        return null;
      }
      return resourceState.resources[id].detail;
    }
  );
};


