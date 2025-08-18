import { Component, effect } from '@angular/core';
import { ImageComponent } from '../../elements';
import { Router } from '@angular/router';
import { AlertService, CartService, UserService } from '../../../core/services';

@Component({
  selector: 'fz-header',
  imports: [ImageComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cardCounter = 0;

  constructor(
    private readonly _router: Router,
    private readonly _user: UserService,
    private readonly _cart: CartService,
    private readonly _alert: AlertService
  ) {
    effect(() => {
      this.cardCounter = _cart.count;
    })
  }
  openCart() {
    if (this._user.current == null) {
      this._router.navigate(['/auth/login']);
      return;
    }
    if (this._cart.count == 0) {
      this._alert.openAlert({
        type: "toast",
        content: {
          title: "No tienes articulos en tu carrito.",
          toastType: "info",
          timer: 3000
        }
      });
      return;
    }

    this._cart.openCart()
  }

  logout() {
    this._user.logout();
  }

  goToHome() {
    this._router.navigate(["/home"]);
  }
}
