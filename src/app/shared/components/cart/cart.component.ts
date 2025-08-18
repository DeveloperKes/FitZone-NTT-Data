import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CartItem, CartService, UserService } from '../../../core/services';
import { CurrencyPipe } from '@angular/common';
import { ProductTypePipe } from '../../pipes';
import { UserProductPayload } from '../../interfaces';
import { UserProductsService } from '../../../core/services/user-products.service';

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
    private readonly _alert: AlertService,
    private readonly _user: UserService,
    private readonly _products: UserProductsService,
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
    if (this._user.current) {
      const toRequest: UserProductPayload[] = this._cart.list.map((item) => {
        return {
          productId: item.itemId,
          token: item.id,
          userId: this._user.current!.id
        }
      })
      this._cart.buyItems(toRequest).subscribe({
        next: (res) => {
          setTimeout(() => {
            this._cart.list = [];
            this._products.addNewProducts(res.data);
            this._alert.openAlert({
              type: 'toast',
              content: {
                title: "¡Compra realizada con éxito!",
                toastType: "success",
                timer: 4000
              }
            })
          }, 600);
        },
        error: () => {
          setTimeout(() => {
            this._alert.openAlert({
              type: 'toast',
              content: {
                title: "Ocurrio un error con la compra",
                toastType: "error",
                timer: 4000
              }
            })
          }, 600);
        }
      });
    }
  }
}
