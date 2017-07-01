/**
 * Created by TrUnK on 11.03.2017.
 */

export interface FormErrorResponse {
  _embedded?: {
    errors: FormError[];
  }
  message?: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormErrorsVM {
  [key: string]: string;
}
