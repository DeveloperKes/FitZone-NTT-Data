import { Injectable, signal, WritableSignal } from '@angular/core';

export type CartItemType = "class" | "plan";

export interface CartItem {
  id: string;
  itemId: number;
  collectionItem: string;
  price: number;
  quantity: number;
  type: CartItemType;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly cartItems: WritableSignal<CartItem[]> = signal([]);

  constructor() { }

  get list() {
    return this.cartItems();
  }

  set list(items: CartItem[]) {
    this.cartItems.set(items);
  }

  get count() {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  addItem(item: Omit<CartItem, "id">) {
    this.cartItems.update(i => [...i, { id: window.crypto.randomUUID(), ...item }]);
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
  }
}
