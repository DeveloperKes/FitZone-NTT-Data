import { Component, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserProduct } from '../../../shared/interfaces';
import { UserProductsService } from '../../../core/services/user-products.service';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';

@Component({
  selector: 'fz-dashboard',
  imports: [RouterLink, CourseCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  products: UserProduct[] = [];

  constructor(
    private readonly _active: ActivatedRoute,
    private readonly _products: UserProductsService
  ) {
    _active.data.subscribe({
      next: (values => {
        _products.list = (values["products"].data || []) as UserProduct[];
      })
    })

    effect(() => {
      this.products = _products.list;
      console.log(this.products);

    })
  }
}
