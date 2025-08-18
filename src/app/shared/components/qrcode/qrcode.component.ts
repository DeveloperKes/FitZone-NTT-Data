import { Component, effect } from '@angular/core';
import { CourseService } from '../../../core/services';
import { UserProductsService } from '../../../core/services/user-products.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'fz-qrcode',
  imports: [QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent {
  token: string = "";
  constructor(
    private readonly _course: CourseService,
    private readonly _product: UserProductsService
  ) {
    effect(() => {
      this.token = _product.qrHash;
    })
  }
}
