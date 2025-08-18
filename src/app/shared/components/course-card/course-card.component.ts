import { Component, Input } from '@angular/core';
import { Course } from '../../interfaces';
import { CurrencyPipe } from '@angular/common';
import { ImageComponent } from '../../elements';
import { AlertService, CartService, CourseService } from '../../../core/services';

@Component({
  selector: 'fz-course-card',
  imports: [CurrencyPipe, ImageComponent],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
})
export class CourseCardComponent {
  @Input() course?: Course;

  constructor(
    private readonly _alert: AlertService,
    private readonly _course: CourseService,
    private readonly _cart: CartService,
  ) { }

  openDetails() {
    if (this.course) {
      this._course.select = this.course;
      this._alert.openAlert({
        type: "modal",
        header: {
          title: this.course.title,
          closeButton: true
        },
        route: ['course', 'details']
      })
    }
  }

  addToCart() {
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
}
