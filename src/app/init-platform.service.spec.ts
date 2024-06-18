import { TestBed } from '@angular/core/testing';

import { InitPlatformService } from './init-platform.service';

describe('InitPlatformService', () => {
  let service: InitPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
