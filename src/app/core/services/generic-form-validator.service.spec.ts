import { TestBed } from '@angular/core/testing';

import { GenericFormValidatorService } from './generic-form-validator.service';

describe('GenericFormValidatorService', () => {
  let service: GenericFormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericFormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
