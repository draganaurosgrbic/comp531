import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Post } from './post';
import { UserService } from 'src/app/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postToPost(post: Post): Post {
    return {
      ...post,
      timestamp: new Date(new Date().valueOf() - Math.random() * (1e+12)),
      author: this.userService.allUsers.find(user => user.id === post.userId)?.displayName || '',
      commentsShowed: false,

      body: post.body.replaceAll('\n', ' '),
    }
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { };

  private readonly POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
  posts!: Post[];
  allPosts!: Post[];

  async readAllPosts() {
    this.allPosts = await this.http.get<Post[]>(this.POSTS_URL).pipe(map(posts => posts.map(post => this.postToPost(post)))).toPromise() as Post[];
  }

  readPosts() {
    const userIds = this.userService.users.map(user => user.id);
    userIds.push(this.userService.profile.id);
    this.posts = this.allPosts.filter(post => userIds.includes(post.userId) || post.id === 0)
      .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());
  }

  filterPosts(text: string) {
    text = text.trim().toLowerCase();
    this.readPosts();
    this.posts = this.posts.filter(post =>
      post.body.toLowerCase().trim().includes(text)
      || post.author.toLowerCase().trim().includes(text));
  }

  addPost(text: string) {
    text = text.trim();
    if (!text) {
      return;
    }

    const post: Post = {
      id: 0,
      userId: this.userService.profile.id,
      title: 'New Post',
      body: text,
      timestamp: new Date(),
      author: this.userService.profile.displayName,
      commentsShowed: false,
    };
    this.allPosts = [post, ...this.allPosts];
    this.readPosts();
  }

}
