import * as _ from 'lodash';

import * as jobsActions from '../actions/jobs.actions';
import { Job } from '../models/jobs.models';
import { createSelector } from 'reselect';

export interface JobResourceMap {
  [key: string]: Job;
}

export interface PageMap {
  [key: string]: number[];
}

export interface FiltersMap {
  [key: string]: string;
}

export enum OrderingEnum {
  RECENT = 0,
  RELEVANT = 1
}

export interface JobState {
  errorMsg: string | null;
  loading: boolean;
  jobResourceMap: JobResourceMap;
  pageMap: PageMap;
  loadedPages: number;
  filters: FiltersMap;
  isListEnded: boolean;
  ordering: OrderingEnum;
}

const initialJobState = {
  errorMsg: null,
  loading: false,
  jobResourceMap: {},
  pageMap: {},
  loadedPages: 0,
  filters: { 'switch': 'recommended' },
  isListEnded: false,
  ordering: OrderingEnum.RECENT
};

export function jobsReducer(state: JobState = initialJobState, action: jobsActions.Actions): JobState {
  switch (action.type) {
    case jobsActions.ActionTypes.LOAD_PAGE: {
      return loadPageHandler(setLoadingHanlder(state, true));
    }
    case jobsActions.ActionTypes.LOAD_NEXT_PAGE: {
      return loadNextPageHandler(state);
    }
    case jobsActions.ActionTypes.LOAD_PAGE_FAIL: {
      return setErrorMsg(state, (action as jobsActions.LoadPageFailAction));
    }
    case jobsActions.ActionTypes.LOAD_PAGE_SUCCESS: {
      return loadPageSuccessHandler(state, (action as jobsActions.LoadPageSuccessAction));
    }
    case jobsActions.ActionTypes.REFRESH_ALL_PAGES_SUCCESS: {
      return RefreshAllPagesSuccessHandler(state, (action as jobsActions.RefreshAllPagesSuccessAction));
    }
    case jobsActions.ActionTypes.SET_ORDERING: {
      return setOrderingHandler(state, (action as jobsActions.SetOrderingAction).payload);
    }
    default: {
      return state;
    }
  }
}

/* ------------------------------------------------------------------ */
/* -------------------------REDUCER HANDLERS------------------------- */
/* ------------------------------------------------------------------ */
function setLoadingHanlder(state: JobState, loadingState: boolean): JobState {
  let newState = _.clone(state);
  newState.loading = loadingState;
  newState.errorMsg = null;
  return newState;
}

function loadPageHandler(state: JobState): JobState {
  let newState = _.clone(state);
  newState.loadedPages = initialJobState.loadedPages;
  newState.pageMap = _.clone(initialJobState.pageMap);
  return newState;
}

function setOrderingHandler(state: JobState, ordering: OrderingEnum): JobState {
  let newState = _.clone(state);
  newState.ordering = ordering;
  return newState;
}

function loadNextPageHandler(state: JobState) {
  let newState = _.clone(state);
  newState.loadedPages++;
  return newState;
}

function setErrorMsg(state: JobState, action: jobsActions.LoadPageFailAction): JobState {
  let newState = _.clone(state);
  newState.loading = false;
  newState.errorMsg = action.payload;
  return newState;
}

function loadPageSuccessHandler(state: JobState, action: jobsActions.LoadPageSuccessAction): JobState {
  let newState = _.cloneDeep(state);
  newState.errorMsg = null;
  newState.loading = false;
  if (!action.payload.response.next) {
    newState.isListEnded = true;
  }
  const timestamp = (new Date()).getTime();
  let jobIds = [];
  _.each(action.payload.response.results, (job: Job) => {
    job["_timestamp"] = timestamp;
    newState.jobResourceMap[job.id] = job;
    jobIds.push(job.id);
  });
  newState.pageMap[action.payload.page] = jobIds;
  return newState;
}

function RefreshAllPagesSuccessHandler(state: JobState, action: jobsActions.RefreshAllPagesSuccessAction): JobState{
  let newState = _.cloneDeep(state);
  newState.errorMsg = null;
  newState.loading = false;
  newState.jobResourceMap = {};
  newState.pageMap = {};
  const loadedPages = action.payload;

  const timestamp = (new Date()).getTime();

  _.each(loadedPages, loadedPage => {
    let jobIds = [];
    _.each(loadedPage.response.results, (job: Job) => {
      job["_timestamp"] = timestamp;
      newState.jobResourceMap[job.id] = job;
      jobIds.push(job.id);
    });
    newState.pageMap[loadedPage.page] = jobIds;
  });

  return newState;
}

/* ------------------------------------------------------------------- */
/* -----------------------------SELECTORS----------------------------- */
/* ------------------------------------------------------------------- */
export const getErrorMsg = (state: JobState) => state.errorMsg;
export const getLoading = (state: JobState) => state.loading;
export const getPage = (state: JobState) => state.loadedPages + 1;
export const getFilters = (state: JobState) => state.filters;
export const getPages = (state: JobState) => state.pageMap;
export const getResources = (state: JobState) => state.jobResourceMap;
export const getListEndedFlag = (state: JobState) => state.isListEnded;
export const getJobListOrdering =(state: JobState) => state.ordering;

export const getAllJobs = createSelector(
  getPages,
  getResources,
  (pages: PageMap, jobs: JobResourceMap): Job[] => {
    let list: Job[] = [];

    list = _.reduce(pages, (sum, resourceList) => {
      return _.concat(sum, _.map(resourceList, (id) => jobs[id] || null));
    }, []);
    return list;
  }
);

export const getAllFilters = createSelector(
  getFilters,
  getJobListOrdering,
  (filters: FiltersMap, ordering: OrderingEnum): FiltersMap => {
    let newFiltersMap = _.clone(filters);
    newFiltersMap.ordering = ordering === OrderingEnum.RECENT ? 'recent' : 'relevant';
    return newFiltersMap;
  }
);
