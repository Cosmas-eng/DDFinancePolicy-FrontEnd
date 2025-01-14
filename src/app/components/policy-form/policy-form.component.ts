import { Component, ElementRef, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';
import { PolicyForm } from 'src/app/core/models';
import { GenericFormValidatorService, PolicyService, uniqueHolderIdValidator, ValidateFormFieldsService } from 'src/app/core/services/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss']
})
export class PolicyFormComponent implements OnInit, AfterViewInit {
  public policyForm!: FormGroup;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  buttonDisabled: boolean = false;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericFormValidatorService;
  private policy!: PolicyForm;;

  constructor(private _fb: FormBuilder, private policyService: PolicyService, private router: Router) {
    this.validationMessages = {
      policyName: {
        required: 'Policy Name is required.',
        minlength: 'Policy Name must be at least three characters.',
        maxlength: 'Policy Name cannot exceed 128 characters.'
      },
      holderId: {
        required: 'Holder ID is required.',
        min: 'Holder ID must be at least one.',
        holderIdNotUnique: 'Policy holder ID already exists.'
      },
      firstName: {
        required: 'First Name is required.',
        minlength: 'First Name must be at least three characters.',
        maxlength: 'First Name cannot exceed 40 characters.'
      },
      lastName: {
        required: 'Last Name is required.',
        minlength: 'Last Name must be at least three characters.',
        maxlength: 'Last Name cannot exceed 40 characters.'
      },
      otherNames: {
        minlength: 'Other Names must be at least three characters.',
        maxlength: 'Other Names cannot exceed 48 characters.'
      },
      countryCode: {
        required: 'Country Code is required.',
        minlength: 'Country Code must be at least two characters.',
        maxlength: 'Country Code cannot exceed 4 characters.'
      },
      phone: {
        required: 'Phone is required.',
        minlength: 'Phone must be at least nine characters.',
        maxlength: 'Phone cannot exceed 15 characters.'
      },
      phoneExtention: {
        minlength: 'Phone Extention must be at least two characters.',
        maxlength: 'Phone Extention cannot exceed 8 characters.'
      },
      premium: {
        required: 'Premium is required.',
        min: 'Premium must be at least one.'
      },
      startDate: {
        required: 'Start Date is required.'
      }
    }
    this.genericValidator = new GenericFormValidatorService(this.validationMessages);
  }
  
  ngOnInit(): void {
    this.policyForm = this._fb.group({
      policyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      holderId: ['', [Validators.required, Validators.min(1)], [uniqueHolderIdValidator(this.policyService)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      otherNames: ['', [Validators.minLength(3), Validators.maxLength(48)]],
      countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(17)]],
      phoneExtention: ['', [Validators.minLength(2), Validators.maxLength(8)]],
      premium: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required]]
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.policyForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
      ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.policyForm);
      });
  }

  onSubmit() {
    if (this.policyForm.valid) {
      this.policy = this.policyForm.value;
      this.policyService.addPolicy(this.policy).subscribe({
        next: () => this.onSubmitComplete(),
        error: err => this.onSubmitFail(err)
      });
    }
    else{
      ValidateFormFieldsService.triggerValidation(this.policyForm);
      this.displayMessage = this.genericValidator.processMessages(this.policyForm);
    }
  }

  onSubmitComplete() {
    this.policyForm.reset();
    console.log(`Policy form successfully submitted`);
    this.router.navigate(['/']);
    this.alertWithSuccess();
  }

  onSubmitFail(err: any) {
    console.log(`Error occurred submitting the policy form: ${err}`)
    this.alertWithFail();
  }

  toDashboard() {
    if (this.policyForm.dirty) {
      Swal.fire({
        title: 'You have made changes',
        text: 'If you cancel without submitting, your changes will be lost',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed){
          this.policyForm.reset();
          this.router.navigate(['/']);
        }
      });
    }
    else {
      this.router.navigate(['/']);
    }
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Form submitted successfully',
      showConfirmButton: false,
      timer: 1500,
      position: 'center'
    })
  }

  alertWithFail() {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      text: 'Please resubmit the form again',
    })
  }
}
