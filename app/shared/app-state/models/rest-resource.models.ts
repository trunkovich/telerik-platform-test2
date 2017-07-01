/**
 * Created by TrUnK on 14.03.2017.
 */

export interface ResourceState {
  resources: ResourceMap;
  list: List;
}

export interface ResourceStateMap {
  // path == 'companies/18/invoices'
  // path == 'companies/18/payment-requests'
  [path: string]: ResourceState;
}

export interface ResourceMap {
  [id: number]: Resource;
}

export interface ResourceDetail {
  id: number;
}

export interface Resource {
  id: number;
  detail?: ResourceDetail;
}

export interface Filters {
  [name: string]: any;
}

export interface ListParams {
  max?: number | null;
  offset?: number | null;
  sort?: string | null;
  order?: string | null;
  filters?: Filters | null;
}

// only ids of resources on each list page.
export interface ListPages {
  [index: number]: number[];
}

export interface List {
  totalCount: number;
  params: ListParams;
  currentPageIndex: number;
  pages: ListPages;
}

export interface ListResponse {
  count: number;
  list: Resource[];
}
