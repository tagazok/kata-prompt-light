import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { webcontainersResolver } from './webcontainers.resolver';

describe('webcontainersResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => webcontainersResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
