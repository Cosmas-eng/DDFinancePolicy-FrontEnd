import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateGreaterThanNowValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values to allow required validator to handle them
    }

    const inputDate = new Date(control.value);
    const currentDate = new Date();

    if (inputDate <= currentDate) {
      return { dateNotGreaterThanNow: true };
    }

    return null;
  };
}