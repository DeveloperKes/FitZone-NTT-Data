import { Component } from '@angular/core';
import { ImageComponent } from '../../elements';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services';

@Component({
  selector: 'fz-header',
  imports: [ImageComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private readonly _router: Router,
    private readonly _user: UserService
  ) { }
  openCart() {
    if (this._user.current == null) this._router.navigate(['auth','login'])
  }
}
