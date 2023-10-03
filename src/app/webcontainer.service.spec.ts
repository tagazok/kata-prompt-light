import { TestBed } from '@angular/core/testing';

import { WebcontainerService } from './webcontainer.service';

describe('WebcontainerService', () => {
  let service: WebcontainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebcontainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
