import { Injectable, Injector } from '@angular/core';
import { Login, Profile, User } from './user';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IMAGE_MAPPING } from '../hard_coded_values';
import { PostsService } from '../main/posts/posts.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  constructor(
    private http: HttpClient,
    private injector: Injector,
  ) { };

  private readonly USERS_URL = 'https://jsonplaceholder.typicode.com/users';
  private readonly STORAGE_KEY = 'auth';
  profile!: Profile;
  users!: Profile[];
  allUsers!: Profile[];

  get postsService() {
    return this.injector.get<PostsService>(PostsService);
  }

  login(data: Login) {
    this.profile = this.allUsers.find(user => user.username === data.username && user.password === data.password) as Profile;
    this.storeProfile();
  }

  logout() {
    this.profile = undefined as unknown as Profile;
    this.removeProfile();
  }

  readProfile() {
    this.profile = JSON.parse(localStorage.getItem(this.STORAGE_KEY) as string) as Profile;
  }

  storeProfile() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.profile));
  }

  removeProfile() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  updateProfile(data: Profile) {
    this.profile.displayName = data.displayName || this.profile.displayName;
    this.profile.email = data.email || this.profile.email;
    this.profile.phone = data.phone || this.profile.phone;
    this.profile.zipcode = data.zipcode || this.profile.zipcode;
    this.profile.password = data.password || this.profile.password;
    // this.storeProfile();
  }

  updateStatusHeadline(text: string) {
    text = text.trim();
    this.profile.statusHeadline = text || this.profile.statusHeadline;
    this.storeProfile();
  }

  register(data: Profile) {
    data = {
      ...data,
      id: 0,
      statusHeadline: "Hi there! I'm learning JavaScript :)",
      image: IMAGE_MAPPING[1]
    }
    if (!this.allUsers.find(user => user.username === data.username)) {
      this.profile = data;
      this.storeProfile();
    }
  }

  async readAllUsers() {
    this.allUsers = await this.http.get<User[]>(this.USERS_URL).pipe(map(users => users.map(user => this.userToProfile(user)))).toPromise() as Profile[];
  }

  readUsers() {
    const userIds = this.profile.id === 0 ? [] : [...Array(3).keys()].map(item => (this.profile.id + item) % 10 + 1);
    this.users = this.allUsers.filter(user => userIds.includes(user.id));
  }

  addUser(username: string): string {
    username = username.trim();
    if (!username) {
      return 'entered empty username';
    }

    const user = this.allUsers.find(user => user.username === username);
    if (!user) {
      return 'unknown user';
    } else if (this.users.find(u => u.username === user.username)) {
      return 'user already followed';
    }

    this.users = [...this.users, user];
    this.postsService.readPosts();
    return '';
  }

  removeUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
    this.postsService.readPosts();
  }

}
