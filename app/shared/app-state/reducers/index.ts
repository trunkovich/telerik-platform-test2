import { createSelector } from 'reselect';
/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { ActionReducer, combineReducers } from '@ngrx/store';
/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromAuth from './auth.reducer';
import * as fromDebug from './debug.reducer';
import * as fromJobs from './jobs.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  auth: fromAuth.AuthState;
  jobs: fromJobs.JobState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  auth: fromAuth.authReducer,
  debug: fromDebug.debugReducer,
  jobs: fromJobs.jobsReducer
};

const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export const getAuthState = (state: AppState) => state.auth;
export const getJobsState = (state: AppState) => state.jobs;


/*======================================================*/
/*====================AUTH SELECTORS====================*/
/*======================================================*/
let getAuthStatus = createSelector(getAuthState, fromAuth.getAuthenticated);
let getAuthError = createSelector(getAuthState, fromAuth.getErrorMsg);
let getAuthLoadingState = createSelector(getAuthState, fromAuth.getLoading);

/*======================================================*/
/*====================JOBS SELECTORS====================*/
/*======================================================*/
let getJobsError = createSelector(getJobsState, fromJobs.getErrorMsg);
let getJobsLoadingState = createSelector(getJobsState, fromJobs.getLoading);
let getJobsPage = createSelector(getJobsState, fromJobs.getPage);
let getJobsFilters = createSelector(getJobsState, fromJobs.getFilters);
let getAllJobsFilters = createSelector(getJobsState, fromJobs.getAllFilters);
let getAllJobs = createSelector(getJobsState, fromJobs.getAllJobs);
let getJobsListEndedFlag = createSelector(getJobsState, fromJobs.getListEndedFlag);
let getJobsListOrdering = createSelector(getJobsState, fromJobs.getJobListOrdering);



export const authSelectors = {
  getAuthStatus: getAuthStatus,
  getError: getAuthError,
  getLoadingState: getAuthLoadingState
};

export const jobsSelectors = {
  getLoading: getJobsLoadingState,
  getErrorMsg: getJobsError,
  getPage: getJobsPage,
  getFilters: getJobsFilters,
  getAllFilters: getAllJobsFilters,
  getAllJobs: getAllJobs,
  getListEndedFlag: getJobsListEndedFlag,
  getOrdering: getJobsListOrdering
};