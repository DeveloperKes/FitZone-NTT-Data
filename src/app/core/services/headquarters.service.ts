import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headquarters, ResponseData } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {


  constructor(private readonly _http: HttpClient) { }

  getAllHeadquarters() {
    return this._http.get<ResponseData<Headquarters[]>>('/api/headquarters');
  }
}
