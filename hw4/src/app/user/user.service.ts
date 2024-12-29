import { Injectable } from '@angular/core';
import { Login, Profile, User } from './user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IMAGE_MAPPING } from '../hard_coded_values';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { };

  private readonly USERS_URL = 'https://jsonplaceholder.typicode.com/users';
  private readonly STORAGE_KEY = 'auth';

  private userToProfile(user: User): Profile {
    return {
      id: user.id,
      statusHeadline: user.company.catchPhrase,
      image: IMAGE_MAPPING[user.id],

      username: user.username,
      displayName: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: new Date(),
      zipcode: user.address.zipcode,
      password: user.address.street,
    }
  }

  storeProfile(user: Profile) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  fetchProfile() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) as string) as Profile;
  }

  removeProfile() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  login(data: Login) {
    return this.http.get<User[]>(this.USERS_URL).pipe(map(users =>
      users.map(user => this.userToProfile(user)).find(user => user.username === data.username && user.password === data.password) as Profile));
  }

  register(data: Profile) {
    data = {
      ...data,
      id: 0,
      statusHeadline: "Hi there! I'm learning JavaScript :)",
      image: IMAGE_MAPPING[1],
    }
    return this.http.get<User[]>(this.USERS_URL).pipe(map(
      users => users.find(user => user.username === data.username) !== undefined ? undefined : data));
  }

  readProfile() {
    return of(this.fetchProfile())
  }

  updateProfile(data: Profile, currentData: Profile): Observable<Profile> {
    return of({
      ...currentData,
      username: data.username || currentData.username,
      email: data.email || currentData.email,
      phone: data.phone || currentData.phone,
      zipcode: data.zipcode || currentData.zipcode,
      password: data.password || currentData.password,
    });
  }

  readFollowedUsers() {
    const userId = this.fetchProfile().id;
    const followedIds = userId !== 0 ? [...Array(3).keys()].map(item => (userId + item) % 10 + 1) : [];
    return this.http.get<User[]>(this.USERS_URL).pipe(map(users =>
      users.filter(user => followedIds.includes(user.id)).map(user => this.userToProfile(user))));
  }

}
