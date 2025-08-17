import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../../shared/interfaces';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'fz-courses',
  imports: [CurrencyPipe],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  $courses: WritableSignal<Course[]> = signal([]);

  constructor(private readonly route: ActivatedRoute) {
    // The courses data is resolved and available here
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.$courses.set(data['courses'] || []);
    });
  }
}
