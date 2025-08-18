import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ResponseData, User } from '../../shared/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly user: WritableSignal<User | null> = signal(JSON.parse(localStorage.getItem("user") ?? "null"));

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) { }

  createUser(user: User) {
    return this._http.post<ResponseData<User>>('/api/users', user);
  }

  loginUser(username: string, password: string) {
    return this._http.post<ResponseData<User>>('/api/login', { username, password });
  }

  get current() {
    return this.user();
  }

  set current(user: User | null) {
    if (user) delete user["password"];
    localStorage.setItem("user", JSON.stringify(user));
    this.user.set(user);
  }

  logout() {
    this.current = null;
    this._router.navigate(["/auth/login"])
  }
}
