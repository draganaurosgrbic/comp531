import { TestBed } from '@angular/core/testing';

import { PostsService } from './posts.service';
import { UserService } from 'src/app/user/user.service';
import { HttpClientModule } from '@angular/common/http';

describe('PostsService', () => {
  let service: PostsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(PostsService);
    userService = TestBed.inject(UserService);
  });

  it('should fetch all articles for current logged in user', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.readPosts();

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(40);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 40);
      expect(post.userId >= 1 && post.userId <= 4);
    }
  });

  it('should fetch subset of articles for current logged in user given search keyword', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.filterPosts('leanne graham');

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(10);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 10);
      expect(post.userId).toEqual(1);
    }

    service.filterPosts('quia et suscipit suscipit recusandae consequuntur expedita et cum');

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(1);
    expect(service.posts[0].userId).toEqual(1);
    expect(service.posts[0].id).toEqual(1);
  });

  it('should add articles when adding a follower', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.readPosts();

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(40);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 40);
      expect(post.userId >= 1 && post.userId <= 4);
    }

    userService.addUser('Kamren');

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(50);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 50);
      expect(post.userId >= 1 && post.userId <= 5);
    }
  });

  it('should remove articles when removing a follower', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.readPosts();

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(40);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 40);
      expect(post.userId >= 1 && post.userId <= 4);
    }

    userService.removeUser(4);

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(30);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 30);
      expect(post.userId >= 1 && post.userId <= 3);
    }
  });

  it('should add a port', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.readPosts();

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(40);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 40);
      expect(post.userId >= 1 && post.userId <= 4);
    }

    service.addPost('post body');

    expect(service.posts.length).toEqual(41);
    expect(service.posts[0].id).toEqual(0);
    expect(service.posts[0].userId).toEqual(userService.profile.id);
    expect(service.posts[0].title).toEqual('New Post');
    expect(service.posts[0].body).toEqual('post body');
    expect(service.posts[0].author).toEqual(userService.profile.displayName);
    expect(service.posts[0].commentsShowed).toBeFalse()
  });

  it('should detect adding an empty post', async () => {
    expect(service.posts).toBeUndefined();

    await userService.readAllUsers();
    await service.readAllPosts();
    userService.login({
      username: 'Bret',
      password: 'Kulas Light',
    });
    userService.readUsers();
    service.readPosts();

    expect(service.posts).toBeDefined();
    expect(service.posts.length).toEqual(40);
    for (const post of service.posts) {
      expect(post.id >= 1 && post.id <= 40);
      expect(post.userId >= 1 && post.userId <= 4);
    }

    service.addPost('');

    expect(service.posts.length).toEqual(40);
  });

  it('should initialize authors with empty strings if no users fetched', async () => {
    expect(service.allPosts).toBeUndefined();

    userService.allUsers = [];
    await service.readAllPosts();

    expect(service.allPosts).toBeDefined();
    expect(service.allPosts.length).toEqual(100);

    for (const post of service.allPosts) {
      expect(post.author).toEqual('');
    }
  });

});
