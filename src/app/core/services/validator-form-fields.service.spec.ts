import { TestBed } from '@angular/core/testing';

import { ValidateFormFieldsService } from './validate-form-fields.service';

describe('ValidatorFormFieldsService', () => {
  let service: ValidateFormFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateFormFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
