import * as _ from 'lodash';
import { AbstractControl, FormGroup } from '@angular/forms';

export function markInvalidFieldsAsTouched(form: FormGroup): void {
  if (form.valid) return;
  _.each<AbstractControl>(form.controls, (control) => {
    if (control.invalid) {
      control.markAsTouched();
    }
  })
}