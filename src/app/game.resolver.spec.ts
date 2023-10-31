import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { gameResolver } from './game.resolver';

describe('gameResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => gameResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
