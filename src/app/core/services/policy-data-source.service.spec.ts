import { TestBed } from '@angular/core/testing';

import { PolicyDataSourceService } from './policy-data-source.service';

describe('PolicyDataSourceService', () => {
  let service: PolicyDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
