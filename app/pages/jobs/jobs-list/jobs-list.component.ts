import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import { Subscription } from 'rxjs/Subscription';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import * as _ from 'lodash';

import { AppState, jobsSelectors } from '../../../shared/app-state/reducers/index';
import {
  LoadNextPageAction, LoadPageAction, RefreshAllPagesAction,
  SetOrderingAction
} from '../../../shared/app-state/actions/jobs.actions';
import { Job } from '../../../shared/app-state/models/jobs.models';
import { SegmentedBar, SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar';
import { OrderingEnum } from '../../../shared/app-state/reducers/jobs.reducer';


@Component({
  moduleId: module.id,
  selector: 'jobs-list',
  templateUrl: 'jobs-list.component.html',
  styleUrls: ['jobs-list-common.component.css', 'jobs-list.component.css']
})
export class JobsListComponent implements OnInit, OnDestroy {
  jobs$: ObservableArray<Job>;
  isListEnded$: Observable<boolean>;
  loading$: Observable<boolean>;
  page = 1;
  preventLoadOnDemand = true;
  loadedTimestamp: number;
  refreshAndLoadHelpers: {
    registerRefreshFunk: (callback: (any) => any) => any;
    registerLoadFunc: (callback: (any) => any) => any;
    execute: () => any;
  };
  sub: Subscription;
  orderingItems: Array<SegmentedBarItem> = [];
  orderingSelected: OrderingEnum;
  initialOrderingSet: boolean;

  constructor(private store: Store<AppState>) {
    _.each(['recent', 'relevant'], (order) => {
      let tmpOrderingItem: SegmentedBarItem = new SegmentedBarItem();
      tmpOrderingItem.title = order;
      this.orderingItems.push(tmpOrderingItem);
    });

    this.refreshAndLoadHelpers = (function() {
      let refreshFunc: any;
      let loadFunc: any;
      return {
        registerRefreshFunk: (callback) => refreshFunc = callback,
        registerLoadFunc: (callback) => loadFunc = callback,
        execute: () => {
          if (loadFunc) {
            loadFunc();
            loadFunc = null;
          }
          if (refreshFunc) {
            refreshFunc();
            refreshFunc = null;
          }
        }
      }
    })();
  }

  ngOnInit() {
    this.jobs$ = new ObservableArray<Job>();
    this.store.dispatch(new LoadPageAction());
    this.sub = this.store.select(jobsSelectors.getAllJobs)
      .filter(jobs => !!jobs && !!jobs.length)
      .subscribe(jobs => {
        if (!this.loadedTimestamp) {
          this.preventLoadOnDemand = false;
          this.jobs$ = new ObservableArray<Job>(jobs);
        } else {
          jobs = _.filter(jobs, (job: Job) => job._timestamp > this.loadedTimestamp);
          this.jobs$.push(...jobs);
        }
        this.loadedTimestamp = jobs[jobs.length - 1]._timestamp;
        this.refreshAndLoadHelpers.execute();
      });

    this.store.select(jobsSelectors.getOrdering)
      .first()
      .subscribe(order => {
        this.orderingSelected = order;
        this.initialOrderingSet = true;
      });

    this.loading$ = this.store.select(jobsSelectors.getLoading);
    this.isListEnded$ = this.store.select(jobsSelectors.getListEndedFlag);
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  onPullToRefreshInitiated(event: ListViewEventData) {
    this.refreshAndLoadHelpers.registerRefreshFunk(() => {
      event.object.notifyPullToRefreshFinished();
    });
    this.loadedTimestamp = null;
    this.store.dispatch(new RefreshAllPagesAction());
  }

  onLoadMoreItemsRequested(event: ListViewEventData) {
    if (this.preventLoadOnDemand) {
      return false;
    }
    this.refreshAndLoadHelpers.registerLoadFunc(() => {
      event.object.notifyLoadOnDemandFinished();
    });
    this.store.dispatch(new LoadNextPageAction());
  }

  onSelectedIndexChange(event) {
    if (this.initialOrderingSet) {
      this.initialOrderingSet = false;
    } else {
      let segmetedBar = <SegmentedBar>event.object;
      this.store.dispatch(new SetOrderingAction(segmetedBar.selectedIndex));
      this.store.dispatch(new LoadPageAction());
      this.loadedTimestamp = null;
    }
  }

  onShare() {
    console.log('onShare');
  }
}
