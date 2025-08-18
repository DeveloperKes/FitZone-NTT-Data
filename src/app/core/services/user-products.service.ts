import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { UserService } from './user.service';
import { ResponseData, UserProduct } from '../../shared/interfaces';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProductsService {

  private readonly products: WritableSignal<UserProduct[]> = signal([]);
  private readonly token: WritableSignal<string> = signal("");
  constructor(
    private readonly _http: HttpClient,
    private readonly _user: UserService
  ) { }

  getProducts() {
    if (this._user.current) {
      return this._http.get<ResponseData<UserProduct[]>>(`/api/users/product/${this._user.current.id}`);
    }
    return of<ResponseData<UserProduct[]>>({ data: [], message: 'No user found', code: 404, error: null } as ResponseData<UserProduct[]>);
  }

  get list() {
    return this.products();
  }

  set list(products: UserProduct[]) {
    this.products.set(products);
  }

  get qrHash() {
    return this.token();
  }

  set qrHash(hash: string) {
    this.token.set(hash);
  }

  addNewProducts(products: UserProduct[]) {
    this.products.update(prev => [...prev, ...products]);
  }
}
