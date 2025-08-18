import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userProductsResolver } from './user-products.resolver';
import { ResponseData, UserProduct } from '../../shared/interfaces';

describe('userProductsResolver', () => {
  const executeResolver: ResolveFn<ResponseData<UserProduct[]>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userProductsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
