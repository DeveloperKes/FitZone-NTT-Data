import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Course, CourseLevel, DayOfWeek, ResponseData, ScheduleShift } from '../../shared/interfaces';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';

export interface CourseFilters {
  level?: CourseLevel[],
  duration?: number[],
  categoryId?: number[],
  headquartersId?: number[],
  schedule?: {
    dayOfWeek: DayOfWeek[],
    shift: ScheduleShift[],
  };
}

export interface FilterPill {
  key: string, value: any
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly course: WritableSignal<Course | null> = signal(null);

  private readonly courses: WritableSignal<Course[]> = signal([]);

  categoriesFilters: WritableSignal<FilterPill[]> = signal([]);
  headquartersFilters: WritableSignal<FilterPill[]> = signal([]);
  daysFilters: WritableSignal<FilterPill[]> = signal([]);
  shiftFilters: WritableSignal<FilterPill[]> = signal([]);
  levelFilters: WritableSignal<FilterPill[]> = signal([]);


  constructor(
    private readonly _http: HttpClient,
    private readonly _alert: AlertService
  ) { }

  getAllCourses() {
    return this._http.get('/api/courses');
  }

  getCoursesByFilter(filters: CourseFilters): Observable<ResponseData<Course[]>> {
    return this._http.post<ResponseData<Course[]>>('/api/courses/filter', {
      filters
    });
  }

  get current() {
    return this.course;
  }

  set select(course: Course) {
    this.course.set(course);
  }

  get list() {
    return this.courses();
  }

  set list(newList: Course[]) {
    this.courses.set(newList)
  }

  applyFilters() {
    this.getCoursesByFilter({
      categoryId: this.categoriesFilters().map(p => parseInt(p.key)),
      headquartersId: this.headquartersFilters().map(p => parseInt(p.key)),
      level: this.levelFilters().map(p => p.key as CourseLevel),
      schedule: {
        dayOfWeek: this.daysFilters().map(p => p.key as DayOfWeek),
        shift: this.shiftFilters().map(p => p.key as ScheduleShift),
      }
    }).subscribe({
      next: (res) => {
        this.list = res.data;
        this._alert.closeAlert();
      }
    })
  }
}
