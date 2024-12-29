import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_URL, ROUTE_PATHS } from 'src/app/constants';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      zipcode: ['', [Validators.pattern('[0-9]{5,5}')]],
      phone: ['', [Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]],
      password: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      passwordConfirmation: ['', []],
    }, {
      validators: [(formGroup: FormGroup) => {
        return formGroup.get('password')?.value !== '' && formGroup.get('password')?.value
          !== formGroup.get('passwordConfirmation')?.value
          ? { passwordConfirmation: true } : null;
      }]
    });
  };

  profile = {
    username: '',
    email: '',
    zipcode: 0,
    phone: '',
    dob: '',
    avatar: '',
  };
  profileForm: FormGroup;
  accountLinked!: boolean;

  get passwordConfirmationError() {
    return this.profileForm.hasError('passwordConfirmation') && this.profileForm.get('passwordConfirmation')?.touched;
  }

  ngOnInit() {
    this.authService.accountLinked().subscribe(res => this.accountLinked = res.accountLinked);

    for (const field in this.profile) {
      if (field === 'username') continue;
      this.profileService.getField(field).subscribe(res => {
        this.profile.username = res.username;
        (this.profile as any)[field] = (res as any)[field];
      });
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      for (const fieldName in this.profileForm.controls) {
        this.profileForm.get(fieldName)?.markAsTouched();
      }
      return;
    }

    for (const field in this.profile) {
      if (this.profileForm.value[field]) {
        this.profileService.updateField(field, this.profileForm.value[field]).subscribe(res => (this.profile as any)[field] = (res as any)[field]);
      }
    }
    if (this.profileForm.value.password) {
      this.authService.updatePassword(this.profileForm.value.password).subscribe(res => console.log(res.password));
    }
    this.profileForm.reset();
  }

  goToMainPage() {
    this.router.navigate([ROUTE_PATHS.MAIN]);
  }

  logout() {
    this.authService.logout().subscribe(
      () => this.router.navigate([ROUTE_PATHS.LANDING]),
      () => this.router.navigate([ROUTE_PATHS.LANDING]),
    );
  }

  uploadAvatar(event: any) {
    const file = event.target.files[0];
    const data = new FormData();
    data.append('avatar', file);
    this.profileService.uploadAvatar(data).subscribe(res => this.profile.avatar = res.avatar);
  }

  linkAccount() {
    if (this.accountLinked) {
      this.authService.unlinkAccount().subscribe(() => this.accountLinked = false);
    } else {
      this.authService.oauthLogin().subscribe(res => {
        if (res.oauthLogin) {
          this.router.navigate([ROUTE_PATHS.LOGIN]);
        } else {
          window.open(`${API_URL}/auth/google`, '_self');
        }
      });
    }
  }

  fieldInvalid(fieldName: string) {
    return this.profileForm.get(fieldName)?.invalid && this.profileForm.get(fieldName)?.touched;
  }

}
