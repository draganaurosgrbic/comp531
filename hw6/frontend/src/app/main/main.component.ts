import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user/user.service';
import { ROUTE_PATHS } from '../constants';
import { Router } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from './posts/posts.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private userService: UserService,
    private postsService: PostsService,
    private router: Router,
  ) { };

  get profile() {
    return this.userService.profile;
  }

  get users() {
    return this.userService.users;
  }

  @ViewChild(PostsComponent) posts!: PostsComponent;

  ngOnInit() {
    this.userService.readProfile();
    this.userService.readAllUsers().then(() => {
      this.userService.readUsers();
      this.postsService.readAllPosts().then(() => this.postsService.readPosts())
    });    
  }

  goToProfilePage() {
    this.router.navigate([ROUTE_PATHS.PROFILE]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate([ROUTE_PATHS.LANDING]);
  }

  updateStatusHeadline(text: string) {
    this.userService.updateStatusHeadline(text);
  }

  userError!: string;

  addUser(username: string) {
    this.userError = this.userService.addUser(username);
  }

  removeUser(id: number) {
    this.userService.removeUser(id);
  }

  addPost(text: string) {
    this.posts.addPost(text);
  }

  filterPosts(text: string) {
    this.posts.filterPosts(text);
  }

}
