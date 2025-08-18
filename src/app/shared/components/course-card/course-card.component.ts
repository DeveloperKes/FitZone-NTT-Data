import { Component, Input } from '@angular/core';
import { Course } from '../../interfaces';
import { CurrencyPipe } from '@angular/common';
import { ImageComponent } from '../../elements';
import { AlertService, CourseService } from '../../../core/services';

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
    private readonly _course: CourseService
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
}
