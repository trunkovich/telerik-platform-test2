export interface Credentials {
  phone: string;
  password: string;
}

export interface ForgotPasswordRequestData {
  phone?: string;
  email?: string;
}

export interface ForgotPasswordResponse {
  does_not_exists?: true
  result: "error" | "success";
}

export interface SignInResponse {
  token: string;
  expires: string;
  user: User;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  get_full_name: string;
  username: string;
  first_name_vocative: string;
  should_change_password: boolean;
  is_staff: boolean;
  is_crm_user: boolean;
  is_manager: boolean;
  profile_url: string;
  mugshot: string;
  date_joined: string;
  email: string;
  phone: string;
  categories: Category[],
  cities: CityToWork[],
  user_type: string;
  stats: {},
  is_seller: boolean;
  gender: string;
  seller: boolean;
  buyer: boolean;
  seller_title: string;
  seller_company_name: string;
  seller_rating: string;
  seller_feedbacks: number;
  vat: Vat,
  seller_profession: string;
  seller_tax_office: string;
  seller_health_insurance_id: null,
  seller_overview: string;
  seller_address: string;
  seller_travel_preferences: string[],
  works_on_saturdays: boolean;
  works_on_sundays: boolean;
  seller_name_display_choice: string;
  seller_notification_phone: boolean;
  seller_notification_email: boolean;
  seller_employees_number: number;
  seller_years_of_service: number;
  last_nps_prompt: null
}

export interface Vat {
  id: number,
  number: string,
  is_valid: boolean,
  is_verified: boolean
}

export interface Category {
  id: number,
  title: string,
  slug: string,
  category_group: CategoryGroup,
  allocation: string,
  credits_model: boolean,
  subscription_model: boolean,
  active: boolean,
  activate: boolean,
  available_for_job: boolean
}

export interface CategoryGroup {
  slug: string,
  id: number,
  title: string
}

export interface CityToWork {
  id: number,
  title: string,
  slug: string,
  active: boolean,
  available_for_job: boolean
}
