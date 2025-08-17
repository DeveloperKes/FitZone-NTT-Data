import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private readonly _http: HttpClient) { }

  getAllCourses() {
    return this._http.get('/api/courses');
  }
}
