import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private readonly _http: HttpClient) { }

  getAllCategories() {
    return this._http.get('/api/categories');
  }
}
