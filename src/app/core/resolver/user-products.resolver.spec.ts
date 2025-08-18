import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userProductsResolver } from './user-products.resolver';

describe('userProductsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userProductsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
