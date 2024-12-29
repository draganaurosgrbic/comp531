import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Registration } from './auth';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  login(data: Login) {
    return this.http.post<{ username: string, result: string }>(`${API_URL}/login`, data);
  }

  register(data: Registration) {
    return this.http.post<{ username: string, result: string }>(`${API_URL}/register`, data);
  }

  logout() {
    return this.http.put<void>(`${API_URL}/logout`, null);
  }

  updatePassword(password: string) {
    return this.http.put<{ username: string, password: string }>(`${API_URL}/password`, { password });
  }

  oauthLogin() {
    return this.http.get<{ username: string, oauthLogin: boolean }>(`${API_URL}/oauth-login`);
  }

  accountLinked() {
    return this.http.get<{ username: string, accountLinked: boolean }>(`${API_URL}/account-linked`);
  }

  unlinkAccount() {
    return this.http.get<void>(`${API_URL}/unlink-account`);
  }

}
