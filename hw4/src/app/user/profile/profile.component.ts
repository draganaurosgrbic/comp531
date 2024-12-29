import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../user';
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
      username: ['', [Validators.pattern('[a-zA-Z]+[a-zA-Z0-9]*')]],
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
  profile!: Profile;

  get passwordConfirmationError() {
    return this.profileForm.hasError('passwordConfirmation') && this.profileForm.get('passwordConfirmation')?.touched;
  }

  goToMainPage() {
    this.router.navigate([ROUTE_PATHS.MAIN]);
  }

  ngOnInit() {
    this.userService.readProfile().subscribe(res => this.profile = res);
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      for (const fieldName in this.profileForm.controls) {
        this.profileForm.get(fieldName)?.markAsTouched();
      }
      return;
    }
    this.userService.updateProfile(this.profileForm.value, this.profile).subscribe(res => {
      this.profile = res;
      this.profileForm.reset();
    });
  }

  fieldInvalid(fieldName: string) {
    return this.profileForm.get(fieldName)?.invalid && this.profileForm.get(fieldName)?.touched;
  }

  logout() {
    this.userService.removeProfile();
    this.router.navigate([ROUTE_PATHS.LANDING]);
  }

  showPassword(password: string) {
    return password.replace(/./g, '*');
  }

}
