import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Course, CourseLevel, DayOfWeek, ResponseData, ScheduleShift } from '../../shared/interfaces';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private course: WritableSignal<Course | null> = signal(null);

  constructor(private readonly _http: HttpClient) { }

  getAllCourses() {
    return this._http.get('/api/courses');
  }

  getCoursesByFilter(filters: CourseFilters): Observable<ResponseData> {
    return this._http.post<ResponseData>('/api/courses/filter', {
      filters
    });
  }

  get current() {
    return this.course;
  }

  set select(course: Course) {
    this.course.set(course);
  }
}
