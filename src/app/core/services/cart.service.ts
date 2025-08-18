import { Injectable, signal, WritableSignal } from '@angular/core';
import { AlertService } from './alert.service';
import { HttpClient } from '@angular/common/http';
import { ResponseData, UserProduct, UserProductPayload } from '../../shared/interfaces';

export type CartItemType = "class" | "plan";

export interface CartItem {
  id: string;
  itemId: number;
  collectionItem: string;
  price: number;
  quantity: number;
  type: CartItemType;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly cartItems: WritableSignal<CartItem[]> = signal(JSON.parse(localStorage.getItem("cart") ?? "[]"));

  constructor(
    private readonly _alert: AlertService,
    private readonly _http: HttpClient
  ) { }

  get list() {
    return this.cartItems();
  }

  set list(items: CartItem[]) {
    this.cartItems.set(items);
    this.saveCartList();
  }

  get count() {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  get total() {
    return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  addItem(newItem: Omit<CartItem, "id">) {
    this.cartItems.update(items => {
      const existing = items.find(
        i => i.itemId === newItem.itemId && i.collectionItem === newItem.collectionItem
      );

      if (existing) {
        return items.map(item =>
          item.itemId === newItem.itemId && item.collectionItem === newItem.collectionItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { id: crypto.randomUUID(), ...newItem, quantity: 1 }];
    });
    this.saveCartList();
  }

  removeItem(itemId: string) {
    this.cartItems.update(items =>
      items.map(item => {
        if (item.id == itemId) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
    this.saveCartList();
  }

  openCart() {
    this._alert.openAlert({
      type: "modal",
      header: {
        title: "Carrito",
        closeButton: true
      },
      route: ["cart"]
    })
  }

  private saveCartList() {
    localStorage.setItem("cart", JSON.stringify(this.list));
  }

  buyItems(products: UserProductPayload[]) {
    return this._http.post<ResponseData<UserProduct[]>>("/api/users/product", { products })
  }
}
