import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
  ) { }

  getField(fieldName: string, username?: string) {
    return this.http.get<{ username: string }>(`${API_URL}/${fieldName}/${username || ''}`);
  }

  updateField(fieldName: string, fieldValue: string) {
    return this.http.put<{ username: string }>(`${API_URL}/${fieldName}`, { [fieldName]: fieldValue });
  }

  uploadAvatar(data: FormData) {
    return this.http.post<{ username: string, avatar: string }>(`${API_URL}/avatar`, data);
  }

}
