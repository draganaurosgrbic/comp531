import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTE_PATHS } from '../constants';
import { Router } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';
import { FollowingService } from './following.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private followingService: FollowingService,
    private router: Router,
  ) { };

  profile = {
    username: '',
    headline: '',
    avatar: '',
  };

  followedUsers!: { username: string, headline: string, avatar: string }[];

  @ViewChild(ArticlesComponent) articles!: ArticlesComponent;

  ngOnInit() {
    for (const field in this.profile) {
      if (field !== 'username') {
        this.profileService.getField(field).subscribe(res => {
          this.profile.username = res.username;
          (this.profile as any)[field] = (res as any)[field];
        });
      }
    }

    this.followingService.getFollowedUsers().subscribe(res => this.setFollowedUsers(res.following));
  }

  private setFollowedUsers(following: string[]) {
    this.followedUsers = [];
    for (const username of following) {
      this.profileService.getField('headline', username).subscribe(res => {
        this.profileService.getField('avatar', username).subscribe(res2 => {
          this.followedUsers.push({
            username,
            headline: (res as any).headline,
            avatar: (res2 as any).avatar,
          });
        })
      });
    }
  }

  goToProfilePage() {
    this.router.navigate([ROUTE_PATHS.PROFILE]);
  }

  logout() {
    this.authService.logout().subscribe(
      () => this.router.navigate([ROUTE_PATHS.LANDING]),
      () => this.router.navigate([ROUTE_PATHS.LANDING]),
    )
  }

  updateHeadline(headline: string) {
    if (!headline.trim()) {
      return;
    }
    this.profileService.updateField('headline', headline).subscribe(res => this.profile.headline = (res as any).headline);
  }

  userError!: string;

  addFollowedUser(username: string) {
    if (!username.trim()) {
      return;
    }
    this.followingService.addFollowedUser(username).subscribe(
      res => {
        this.setFollowedUsers(res.following);
        this.articles.getArticles();
      },
      res => this.userError = res.error.details,
    );
  }

  removeFollowedUser(username: string) {
    this.followingService.removeFollowedUser(username).subscribe(res => {
      this.setFollowedUsers(res.following);
      this.articles.getArticles();
    });
  }

  articleImage: any;

  uploadArticleImage(event: any) {
    this.articleImage = event.target.files[0];
  }

  createArticle(text: string) {
    this.articles.createArticle(text, this.articleImage);
  }

  filterArticles(text: string) {
    this.articles.filterArticles(text);
  }

}
