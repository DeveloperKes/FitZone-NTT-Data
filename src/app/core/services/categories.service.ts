import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, ResponseData } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private readonly _http: HttpClient) { }

  getAllCategories() {
    return this._http.get<ResponseData<Category[]>>('/api/categories');
  }
}
