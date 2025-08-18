import { Component, effect } from '@angular/core';
import { Course } from '../../interfaces';
import { AlertService, CartService, CourseService } from '../../../core/services';
import { ImageComponent } from '../../elements';
import { CurrencyPipe } from '@angular/common';
import { LevelPipe } from '../../pipes';
import { SchedulePipe } from '../../pipes/schedule.pipe';

@Component({
  selector: 'fz-course-details',
  imports: [ImageComponent, CurrencyPipe, LevelPipe, SchedulePipe],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
  course: Course | null = null;

  constructor(
    private readonly _course: CourseService,
    private readonly _alert: AlertService,
    private readonly _cart: CartService
  ) {
    effect(() => {
      this.course = _course.current();
      console.log(this.course);

    })
  }

  addCartItem() {
    if (this.course) {
      this._cart.addItem({
        collectionItem: "courses",
        itemId: this.course.id,
        price: this.course.price,
        quantity: 1,
        type: 'class',
        name: this.course.title
      })
    }
  }

  addCartAndGoToPay() {
    this.addCartItem();
    this._alert.closeAlert();

    setTimeout(() => {
      this._cart.openCart();
    }, 600)
  }

  goToMaps() {
    if (this.course?.headquarters) {
      const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
      const encoded = encodeURIComponent(this.course?.headquarters.address);
      window.open(baseUrl + encoded, "_blank");
    }
  }

  showModal() {
    this._alert.closeAlert();
    setTimeout(() => {
      this._course.showModal();
    }, 700);
  }
}
