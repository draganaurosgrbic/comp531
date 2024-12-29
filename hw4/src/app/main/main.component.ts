import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user/user.service';
import { Profile } from '../user/user';
import { ROUTE_PATHS } from '../constants';
import { Router } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { IMAGE_MAPPING } from '../hard_coded_values';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { };

  users!: Profile[];
  profile!: Profile;

  @ViewChild(PostsComponent) posts!: PostsComponent;

  goToProfilePage() {
    this.router.navigate([ROUTE_PATHS.PROFILE]);
  }

  ngOnInit() {
    this.profile = this.userService.fetchProfile();
    this.userService.readFollowedUsers().subscribe(res => this.users = res);
  }

  logout() {
    this.userService.removeProfile();
    this.router.navigate([ROUTE_PATHS.LANDING]);
  }

  addPost(text: string) {
    text = text.trim();
    if (!text) {
      return;
    }
    this.posts.addPost(text);
  }

  filterPosts(text: string) {
    this.posts.filterPosts(text);
  }

  updateHeadline(text: string) {
    text = text.trim();
    if (!text) {
      return;
    }
    this.profile.statusHeadline = text;
  }

  addUser(username: string) {
    username = username.trim();
    if (!username
      || this.users.find(user => user.username.toLowerCase().trim() === username.toLowerCase().trim())) {
      return;
    }
    this.users = [
      ...this.users,
      {
        id: this.users.length * 10 + 1,
        statusHeadline: 'I just want to make things up',
        image: IMAGE_MAPPING[1],
        username,

        displayName: 'dummy display name',
        email: 'asd@gmail.com',
        phone: '123-123-1234',
        birthDate: new Date(),
        zipcode: '77030',
        password: 'asd'
      },
    ];
  }

  removeUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }

}
