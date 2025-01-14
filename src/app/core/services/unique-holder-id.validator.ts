import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PolicyService } from '../services/policy.service';

export function uniqueHolderIdValidator(policyService: PolicyService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return policyService.checkHolderIdUnique(control.value).pipe(
      map(isUnique => (isUnique ? null : { holderIdNotUnique: true })),
      catchError(() => of(null))
    );
  };
}