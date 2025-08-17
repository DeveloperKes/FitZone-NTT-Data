import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseLevel, DayOfWeek, ResponseData, ScheduleShift } from '../../shared/interfaces';
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

  constructor(private readonly _http: HttpClient) { }

  getAllCourses() {
    return this._http.get('/api/courses');
  }

  getCoursesByFilter(filters: CourseFilters): Observable<ResponseData> {
    return this._http.post<ResponseData>('/api/courses/filter', {
      filters
    });
  }
}
