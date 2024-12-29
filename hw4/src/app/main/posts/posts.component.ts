import { Component, OnInit } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './post';
import { POST_IMAGES } from 'src/app/hard_coded_values';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private postsService: PostsService,
  ) { };

  posts!: Post[];
  filteredPosts!: Post[];

  ngOnInit() {
    this.postsService.readPosts().subscribe(res => {
      this.posts = res;
      this.filterPosts('');
    });
  }

  postImage(postId: number) {
    return POST_IMAGES[postId % POST_IMAGES.length];
  }

  filterPosts(text: string) {
    const filterText = text.toLowerCase().trim();
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().trim().includes(filterText)
      || post.body.toLowerCase().trim().includes(filterText)
      || post.author.toLowerCase().trim().includes(filterText)
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  addPost(text: string) {
    const newPost: Post = {
      userId: this.userService.fetchProfile().id,
      id: 0,
      title: 'New Post',
      body: text,

      timestamp: new Date(),
      author: this.userService.fetchProfile().displayName
    };
    this.posts = [newPost, ...this.posts];
    this.filterPosts('');
  }

}
