import { TestBed } from '@angular/core/testing';

import { LoadingScreenStateService } from './loading-screen-state.service';

describe('LoadingScreenStateService', () => {
  let service: LoadingScreenStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingScreenStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
