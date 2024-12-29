import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  constructor(
    private http: HttpClient,
  ) { }

  getFollowedUsers() {
    return this.http.get<{ username: string, following: string[] }>(`${API_URL}/following`);
  }

  addFollowedUser(username: string) {
    return this.http.put<{ username: string, following: string[] }>(`${API_URL}/following/${username}`, null);
  }

  removeFollowedUser(username: string) {
    return this.http.delete<{ username: string, following: string[] }>(`${API_URL}/following/${username}`);
  }

}
