import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class ValidateFormFieldsService {

  static triggerValidation(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.triggerValidation(control);
      } else if (control instanceof FormArray) {
        for (const groupKey in control.controls) {
          const g = control.controls[groupKey];
          if (g instanceof FormGroup) {
            this.triggerValidation(g);
          }
        }
      }
    });
  }
}
