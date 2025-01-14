import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';
import { Policy, PolicyContact, PolicyPremium, PolicyStatus, StatusOptions } from 'src/app/core/models/index';
import { dateGreaterThanNowValidator, GenericFormValidatorService, PolicyService, ValidateFormFieldsService } from 'src/app/core/services/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit, AfterViewInit {

  policy: Policy | null = null;
  contactButton: boolean = false;
  public contactForm!: FormGroup;
  premiumButton: boolean = false;
  public premiumForm!: FormGroup;
  statusButton: boolean = false;
  public statusForm!: FormGroup;
  @ViewChildren('formInput') formInputElements!: QueryList<ElementRef>;
  private contact!: PolicyContact
  private premium!: PolicyPremium;
  private status!: PolicyStatus;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericFormValidatorService;
  statusOptions = [
      { value: StatusOptions.Active, viewValue: 'Active' },
      { value: StatusOptions.Inactive, viewValue: 'Inactive' },
      { value: StatusOptions.Pending, viewValue: 'Pending' },
      { value: StatusOptions.Cancelled, viewValue: 'Cancelled' }
    ];

  constructor(private _fb: FormBuilder, private policyService: PolicyService, private route: ActivatedRoute, private router: Router) {
    this.validationMessages = {
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
      newPolicyValue: {
        required: 'Policy Value is required.',
        min: 'Policy Value must be at least one.'
      },
      effectiveDate: {
        required: 'Effective Date is required.',
        dateNotGreaterThanNow: 'Effective Date must be greater than the current date.'
      },
      newStatus: {
        required: 'Status is required.'
      }
    };
    this.genericValidator = new GenericFormValidatorService(this.validationMessages);
   }

  ngOnInit(): void {
    const policyId = Number(this.route.snapshot.paramMap.get('id'));
    if (policyId) {
      this.policyService.getPolicy(policyId).subscribe({
        next: (policy: Policy) => {
          this.policy = policy;
        },
        error: (err: any) => console.error(err)
      });
    }

    this.contactForm = this._fb.group({
      countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(17)]],
      phoneExtention: ['', [Validators.minLength(2), Validators.maxLength(8)]]
    });
    this.premiumForm = this._fb.group({
      newPolicyValue: ['', [Validators.required, Validators.min(1)]],
      effectiveDate: ['', [Validators.required, dateGreaterThanNowValidator()]]
    });
    this.statusForm = this._fb.group({
      newStatus: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(
      this.contactForm.valueChanges, this.premiumForm.valueChanges, this.statusForm.valueChanges, ...controlBlurs
    ).pipe(debounceTime(800)).subscribe(() => {
      this.displayMessage = {
        ...this.genericValidator.processMessages(this.contactForm),
        ...this.genericValidator.processMessages(this.premiumForm),
        ...this.genericValidator.processMessages(this.statusForm)
      };
    });
  }

  onContactEdit() {
    this.contactButton = true;
    this.contactForm.reset();
  }

  onContactSubmit() {
    if (this.contactForm.valid) {
      this.contact = this.contactForm.value;
      this.contact.Id = this.policy?.policyId!;
      console.log(this.contact);
      this.policyService.updatePolicyContact(this.contact).subscribe({
        next: (policy: Policy) => {
          this.onSubmitComplete(policy, this.contactForm);
          this.contactButton = false;
        },
        error: err => this.onSubmitFail(err)
      });
    }
    else{
      ValidateFormFieldsService.triggerValidation(this.contactForm);
      this.displayMessage = this.genericValidator.processMessages(this.contactForm);
    }
  }

  cancelContact() {
    if (this.contactForm.dirty){
      Swal.fire({
        title: 'Discard changes?',
        text: 'If you continue, your changes will be lost',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed){
          this.contactForm.reset();
          this.contactButton = false;
        }
      });
    }
    else{
      this.contactButton = false;
    }
  }

  onPremiumEdit() {
    this.premiumButton = true;
    this.premiumForm.reset();
  }

  onPremiumSubmit() {
    if (this.premiumForm.valid) {
      this.premium = this.premiumForm.value;
      this.premium.Id = this.policy?.policyId!;
      console.log(this.premium);
      this.policyService.updatePolicyPremium(this.premium).subscribe({
        next: (policy: Policy) => {
          this.onSubmitComplete(policy, this.premiumForm);
          this.premiumButton = false;
        },
        error: err => this.onSubmitFail(err)
      });
    }
    else{
      ValidateFormFieldsService.triggerValidation(this.premiumForm);
      this.displayMessage = this.genericValidator.processMessages(this.premiumForm);
    }
  }

  cancelPremium() {
    if (this.premiumForm.dirty){
      Swal.fire({
        title: 'Discard changes?',
        text: 'If you continue, your changes will be lost',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed){
          this.premiumForm.reset();
          this.premiumButton = false;
        }
      });
    }
    else{
      this.premiumButton = false;
    }
  }

  onPolicyStatusEdit() {
    this.statusButton = true;
    this.statusForm.reset();
    this.statusForm.patchValue({newStatus: this.policy?.policyStatus})
  }

  onStatusSubmit() {
    if (this.statusForm.valid) {
      this.status = this.statusForm.value;
      this.status.Id = this.policy?.policyId!;
      this.policyService.updatePolicyStatus(this.status).subscribe({
        next: (policy: Policy) => {
          this.onSubmitComplete(policy, this.statusForm);
          this.statusButton = false;
        },
        error: err => this.onSubmitFail(err)
      });
    }
    else{
      ValidateFormFieldsService.triggerValidation(this.statusForm);
      this.displayMessage = this.genericValidator.processMessages(this.statusForm);
    }
  }

  cancelStatus() {
    if (this.statusForm.dirty){
      Swal.fire({
        title: 'Discard changes?',
        text: 'If you continue, your changes will be lost',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed){
          this.statusForm.reset();
          this.statusButton = false;
        }
      });
    }
    else{
      this.statusButton = false;
    }
  }

  onSubmitComplete(policy: Policy, form: FormGroup) {
    form.reset();
    console.log(`Update successfully submitted`);
    this.policy = policy;
    this.alertWithSuccess();
  }

  toDashboard() {
    if (this.contactForm.dirty || this.premiumForm.dirty || this.statusForm.dirty) {
      Swal.fire({
        title: 'You were making updates',
        text: 'If you continue without submitting, your changes will be lost',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed){
          this.contactForm.reset();
          this.premiumForm.reset();
          this.statusForm.reset();
          this.router.navigate(['/']);
        }
      });
    }
    else {
      this.router.navigate(['/']);
    }
  }

  deletePolicy() {
    Swal.fire({
      title: 'Delete Policy Item?',
      text: 'If you continue, this process cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, keep item'
    }).then((result) => {
      if (result.isConfirmed){
        this.policyService.deletePolicy(this.policy?.policyId!).subscribe({
          next: () => this.router.navigate(['/']),
          error: err => this.onSubmitFail(err)
        });
      }
    });
  }
  
  onSubmitFail(err: any) {
    console.log(`Error occurred submitting the update: ${err}`)
    this.alertWithFail();
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Update submitted successfully',
      showConfirmButton: false,
      timer: 1500,
      position: 'center'
    })
  }

  alertWithFail() {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      text: 'Please resubmit the request again',
    })
  }
}
