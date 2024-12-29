import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Post } from './post';
import { UserService } from 'src/app/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postToPost(post: Post): Post{
    return {
      ...post,
      timestamp: new Date(new Date().valueOf() - Math.random()*(1e+12))      ,
      author: this.userService.fetchProfile().displayName
    }
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { };

  private readonly POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

  readPosts() {
    const userId = this.userService.fetchProfile().id;
    return this.http.get<Post[]>(this.POSTS_URL).pipe(map(posts => posts.filter(post => post.userId === userId).map(post => this.postToPost(post))))
  }

}
