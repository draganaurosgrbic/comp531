import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from 'src/app/constants';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z]+[a-zA-Z0-9]*')]],
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]],
      birthDate: ['', [Validators.required, (control: AbstractControl) => {
        const now = new Date();
        const birth = new Date(Date.parse(control.value));

        let age = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
          --age;
        }

        return age >= 18 ? null : { birthDate: true };
      }]],
      zipcode: ['', [Validators.required, Validators.pattern('[0-9]{5,5}')]],
      password: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      passwordConfirmation: ['', []],
    }, {
      validators: [(formGroup: FormGroup) => {
        return formGroup.get('password')?.value
          !== formGroup.get('passwordConfirmation')?.value
          ? { passwordConfirmation: true } : null;
      }]
    });
  };

  registrationForm: FormGroup;

  get formInvalid() {
    return this.registrationForm.hasError('takenUsername');
  }

  get passwordConfirmationError() {
    return this.registrationForm.hasError('passwordConfirmation') && this.registrationForm.get('passwordConfirmation')?.touched;
  }

  register() {
    if (!this.registrationForm.valid) {
      for (const fieldName in this.registrationForm.controls) {
        this.registrationForm.get(fieldName)?.markAsTouched();
      }
      return;
    }
    this.userService.register(this.registrationForm.value).subscribe(res => {
      if (res !== undefined) {
        this.userService.storeProfile(res);
        this.router.navigate([ROUTE_PATHS.MAIN]);
      } else {
        this.registrationForm.setErrors({ takenUsername: true });
      }
    });
  }

  fieldInvalid(fieldName: string) {
    return this.registrationForm.get(fieldName)?.invalid && this.registrationForm.get(fieldName)?.touched;
  }

}
