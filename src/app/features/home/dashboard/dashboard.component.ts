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
        _products.list = ([...new Map((values["products"].data || []).map((obj: any) => [obj.product.id, obj])).values()]) as UserProduct[];
      })
    })

    effect(() => {
      this.products = [...new Map(_products.list.map(obj => [obj.product.id, obj])).values()];
    })
  }
}
