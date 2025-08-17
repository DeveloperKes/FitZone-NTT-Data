import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly _http: HttpClient) { }

  createUser(user: User) {
    return this._http.post<User>('/api/users', user);
  }

  loginUser(username: string, password: string) {
    return this._http.post<User>('/api/login', { username, password });
  }
}
