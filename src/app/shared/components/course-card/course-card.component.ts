import { Component, Input } from '@angular/core';
import { Course } from '../../interfaces';
import { CurrencyPipe } from '@angular/common';
import { ImageComponent } from '../../elements';

@Component({
  selector: 'fz-course-card',
  imports: [CurrencyPipe, ImageComponent],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
})
export class CourseCardComponent {
  @Input() course?: Course;
}
