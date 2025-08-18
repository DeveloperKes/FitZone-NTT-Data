import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {


  constructor(private readonly _http: HttpClient) { }

  getAllHeadquarters() {
    return this._http.get('/api/headquarters');
  }
}
