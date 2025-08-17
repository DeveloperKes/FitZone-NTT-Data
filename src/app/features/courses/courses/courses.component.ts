import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, } from '../../../shared/interfaces';
import { CourseService } from '../../../core/services';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';

@Component({
  selector: 'fz-courses',
  imports: [CourseCardComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _course: CourseService,
  ) {

  }

  ngOnInit() {
    this.route.data.subscribe(requests => {
      this.courses = requests['courses'].data || [];
    });
  }


}
