import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTE_PATHS } from 'src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.profileForm = this.formBuilder.group({
      displayName: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]],
      zipcode: ['', [Validators.pattern('[0-9]{5,5}')]],
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

  profileForm: FormGroup;

  get profile() {
    return this.userService.profile;
  }

  get passwordConfirmationError() {
    return this.profileForm.hasError('passwordConfirmation') && this.profileForm.get('passwordConfirmation')?.touched;
  }

  ngOnInit() {
    this.userService.readProfile();
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      for (const fieldName in this.profileForm.controls) {
        this.profileForm.get(fieldName)?.markAsTouched();
      }
      return;
    }
    this.userService.updateProfile(this.profileForm.value);
    this.profileForm.reset();
  }

  fieldInvalid(fieldName: string) {
    return this.profileForm.get(fieldName)?.invalid && this.profileForm.get(fieldName)?.touched;
  }

  goToMainPage() {
    this.router.navigate([ROUTE_PATHS.MAIN]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate([ROUTE_PATHS.LANDING]);
  }

  showPassword(password?: string) {
    return password ? password.replace(/./g, '*') : '';
  }

}
