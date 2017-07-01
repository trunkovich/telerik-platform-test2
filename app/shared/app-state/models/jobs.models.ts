import { Category, CityToWork } from './auth.models';

export interface JobsListResponse {
  count: number;
  pos: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

export interface Buyer {
  phone: string | null;
  email: string | null;
  get_full_name: string | null
}

export interface ValueAttribute {
  title: string | null;
  datatype: string | null;
  slug: string | null
}

export interface ValueChoice {
  title: string;
}

export interface Value {
  attribute: ValueAttribute;
  value_choice: ValueChoice;
  value_choices: ValueChoice[];
  value_text: null;
  value_float: null;
  value_int: null;
  value_date: null;
  value_time: null;
  value_bool: null;
  value_geo: null
}

export interface Job {
  id: number | null;
  title: string | null;
  buyer: Buyer;
  category: Category;
  cities: CityToWork[];
  values: Value[];
  credits_model: true;
  acquisition_valuation: number | null;
  success_valuation: number | null;
  subscription_model: false;
  acquisition_bids: number | null;
  status: string | null;
  basket: string | null;
  created: string | null;
  offers: number | null;
  date_activated: string | null;
  date_concluded: null;
  requests: number | null;
  opens: number | null;
  hired: number | null;
  is_accepting_opencontacts: true;
  is_accepting_bids: true;
  can_bid: false;
  can_view: false;
  can_buy: true;
  can_edit: false;
  favored: false;
  bought: false;
  ct_id: number | null;
  is_concluded: false;
  is_expired: false;
  has_seller_feedback: false;
  cancel_reason_seller_message: null;
  status_seller_display: string | null;
  asked_more_bids: false;
  is_direct_allocation: false
  _timestamp: number;
}