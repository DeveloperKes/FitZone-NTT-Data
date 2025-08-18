import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CartItem, CartService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';
import { ProductTypePipe } from '../../pipes';

@Component({
  selector: 'fz-cart',
  imports: [CurrencyPipe, ProductTypePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cardItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(
    private readonly _router: Router,
    private readonly _cart: CartService,
    private readonly _alert: AlertService
  ) {
    effect(() => {
      this.cardItems = _cart.list;
      this.cartTotal = _cart.total;

      if (_cart.count == 0) {
        _alert.closeAlert();
      }
    })
  }

  removeItem(id: string) {
    this._cart.removeItem(id);
  }

  addItem(item: CartItem) {
    this._cart.addItem({
      ...item,
      quantity: 1
    })
  }

  buy() {
    this._alert.closeAlert();


    setTimeout(() => {
      this._cart.list = [];
      this._alert.openAlert({
        type: 'toast',
        content: {
          title: "¡Compra realizada con éxito!",
          toastType: "success",
          timer: 4000
        }
      })
    }, 600);
  }
}
