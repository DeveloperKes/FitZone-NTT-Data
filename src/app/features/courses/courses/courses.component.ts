import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, } from '../../../shared/interfaces';
import { AlertService, CourseService } from '../../../core/services';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fz-courses',
  imports: [CourseCardComponent, ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  form: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly _course: CourseService,
    private readonly _alert: AlertService,
    private readonly _fb: FormBuilder
  ) {
    this.form = _fb.group({
      search: ["", []]
    })
    effect(() => {
      this.courses = _course.list;
    })
    this.form.controls["search"].valueChanges.subscribe({
      next: (value: string) => this.search()
    })
  }

  ngOnInit() {
    this.route.data.subscribe(requests => {
      console.log(requests['courses']);

      this._course.list = (requests['courses'].data || []) as Course[];
    });
  }

  openFilters() {
    this._alert.openAlert({
      type: "modal",
      header: {
        closeButton: true,
        title: "Personalizar búsqueda"
      },
      route: ['filters']
    })
  }

  search() {
    const strValue: string = this.form.controls["search"].value;
    if (strValue != "") {
      this.courses = this._course.list.filter((course) =>
        course.title.toLowerCase().includes(strValue.toLowerCase())
      )
    }
    else this.courses = this._course.list;
  }

}
