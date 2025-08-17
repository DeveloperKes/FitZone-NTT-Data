import { Component } from '@angular/core';
import { Category, Course, Headquarters } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services';

@Component({
  selector: 'fz-filter-box',
  imports: [],
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.scss'
})
export class FilterBoxComponent {
  headquarters: Headquarters[] = [];
  categories: Category[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _course: CourseService,
  ) {

  }

  ngOnInit() {
    this.route.data.subscribe(requests => {
      this.headquarters = requests['headquarters'].data || [];
      this.categories = requests['categories'].data || [];
    });
  }
  applyFilters() {
    this._course.getCoursesByFilter({
      categoryId: [1],
      // headquartersId: [1],
      level: ["advanced", "beginner"],
      schedule: {
        dayOfWeek: ["monday"],
        shift: ["morning"],
      }
    }).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }
}
