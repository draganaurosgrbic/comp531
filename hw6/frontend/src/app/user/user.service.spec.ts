import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { Profile } from './user';
import { IMAGE_MAPPING } from '../hard_coded_values';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should log in a previously registered user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();
  });

  it('should not log in an invalid user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'asd',
      password: 'asd',
    });

    expect(service.profile).toBeUndefined();
  });

  it('should log out a user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();

    service.logout();

    expect(service.profile).toBeUndefined();
  });

  it("should fetch the logged in user's profile username", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();

    service.readProfile();

    expect(service.profile.id).toEqual(1);
    expect(service.profile.statusHeadline).toEqual('Multi-layered client-server neural-net');
    expect(service.profile.image).toEqual('https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg');
    expect(service.profile.username).toEqual('Bret');
    expect(service.profile.displayName).toEqual('Leanne Graham');
    expect(service.profile.email).toEqual('Sincere@april.biz');
    expect(service.profile.phone).toEqual('1-770-736-8031 x56442');
    expect(service.profile.zipcode).toEqual('92998-3874');
    expect(service.profile.password).toEqual('Kulas Light');
  });

  it("should update user's profile", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();
    expect(service.profile.displayName).toEqual('Leanne Graham');
    expect(service.profile.email).toEqual('Sincere@april.biz');
    expect(service.profile.phone).toEqual('1-770-736-8031 x56442');
    expect(service.profile.zipcode).toEqual('92998-3874');
    expect(service.profile.password).toEqual('Kulas Light');

    service.updateProfile({
      displayName: 'display name',
      email: 'email',
      phone: 'phone',
      zipcode: 'zip code',
      password: 'password',
    } as Profile);

    expect(service.profile.displayName).toEqual('display name');
    expect(service.profile.email).toEqual('email');
    expect(service.profile.phone).toEqual('phone');
    expect(service.profile.zipcode).toEqual('zip code');
    expect(service.profile.password).toEqual('password');
  });

  it("should update user's status headline", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();
    expect(service.profile.statusHeadline).toEqual('Multi-layered client-server neural-net');

    service.updateStatusHeadline('status headline');

    expect(service.profile.statusHeadline).toEqual('status headline');
  });

  it("should register a user", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.register({
      username: 'username',
      displayName: 'display name',
      email: 'email',
      phone: 'phone',
      birthDate: new Date(),
      zipcode: 'zip code',
      password: 'password',
    } as Profile);

    expect(service.profile).toBeDefined();
    expect(service.profile.id).toEqual(0);
    expect(service.profile.statusHeadline).toEqual("Hi there! I'm learning JavaScript :)");
    expect(service.profile.image).toEqual(IMAGE_MAPPING[1]);
    expect(service.profile.username).toEqual('username');
    expect(service.profile.displayName).toEqual('display name');
    expect(service.profile.email).toEqual('email');
    expect(service.profile.phone).toEqual('phone');
    expect(service.profile.zipcode).toEqual('zip code');
    expect(service.profile.password).toEqual('password');
  });

  it('should detect adding an empty user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();

    service.readUsers();

    expect(service.addUser('')).toEqual('entered empty username')
    expect(service.users.length).toEqual(3);
  });

  it('should detect adding an unknown user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();

    service.readUsers();

    expect(service.addUser('test')).toEqual('unknown user');
    expect(service.users.length).toEqual(3);
  });

  it('should detect adding an already followed user', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();

    service.readUsers();

    expect(service.addUser('Antonette')).toEqual('user already followed')
    expect(service.users.length).toEqual(3);
  });

  it("should not update user'profile with empty values", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();
    expect(service.profile.displayName).toEqual('Leanne Graham');
    expect(service.profile.email).toEqual('Sincere@april.biz');
    expect(service.profile.phone).toEqual('1-770-736-8031 x56442');
    expect(service.profile.zipcode).toEqual('92998-3874');
    expect(service.profile.password).toEqual('Kulas Light');

    service.updateProfile({
      displayName: '',
      email: '',
      phone: '',
      zipcode: '',
      password: '',
    } as Profile);

    expect(service.profile.displayName).toEqual('Leanne Graham');
    expect(service.profile.email).toEqual('Sincere@april.biz');
    expect(service.profile.phone).toEqual('1-770-736-8031 x56442');
    expect(service.profile.zipcode).toEqual('92998-3874');
    expect(service.profile.password).toEqual('Kulas Light');
  });

  it("should not update user's status headline with empty value", async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.login({
      username: 'Bret',
      password: 'Kulas Light',
    });

    expect(service.profile).toBeDefined();
    expect(service.profile.statusHeadline).toEqual('Multi-layered client-server neural-net');

    service.updateStatusHeadline('');

    expect(service.profile.statusHeadline).toEqual('Multi-layered client-server neural-net');
  });

  it('should show no followed users when a user registers', async () => {
    expect(service.profile).toBeUndefined();

    await service.readAllUsers();
    service.register({
      username: 'username',
      displayName: 'display name',
      email: 'email',
      phone: 'phone',
      birthDate: new Date(),
      zipcode: 'zip code',
      password: 'password',
    } as Profile);

    expect(service.profile).toBeDefined();

    service.readUsers();

    expect(service.users).toBeDefined();
    expect(service.users.length).toEqual(0);
  });

});
