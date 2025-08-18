import { ResolveFn } from '@angular/router';
import { UserProductsService } from '../services/user-products.service';
import { inject } from '@angular/core';
import { ResponseData, UserProduct } from '../../shared/interfaces';

export const userProductsResolver: ResolveFn<ResponseData<UserProduct[]>> = () => {
  const userProduct = inject(UserProductsService);
  return userProduct.getProducts();
};
