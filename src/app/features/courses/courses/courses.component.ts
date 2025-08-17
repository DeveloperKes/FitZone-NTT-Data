import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Course, Headquarters } from '../../../shared/interfaces';
import { CurrencyPipe } from '@angular/common';
import { CourseService } from '../../../core/services';

@Component({
  selector: 'fz-courses',
  imports: [CurrencyPipe],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  headquarters: Headquarters[] = [];
  categories: Category[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _course: CourseService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(requests => {
      console.log(requests);

      this.courses = requests['courses'].data || [];
      this.headquarters = requests['headquarters'].data || [];
      this.categories = requests['categories'].data || [];
    });
  }

  applyFilters() {
    this._course.getCoursesByFilter({
      // categoryId: [2],
      headquartersId: [1],
      level: ["advanced"]
    }).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }
}
