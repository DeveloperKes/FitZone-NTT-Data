import { Component, effect } from '@angular/core';
import { Course } from '../../interfaces';
import { CourseService } from '../../../core/services';
import { ImageComponent } from '../../elements';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fz-course-details',
  imports: [ImageComponent, CurrencyPipe],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
  course: Course | null = null;

  constructor(private readonly _course: CourseService) {
    effect(() => {
      this.course = _course.current();
    })
  }
}
