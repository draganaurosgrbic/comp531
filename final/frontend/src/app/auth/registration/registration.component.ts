import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from 'src/app/constants';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z]+[a-zA-Z0-9]*')]],
      email: ['', [Validators.required, Validators.email]],
      zipcode: ['', [Validators.required, Validators.pattern('[0-9]{5,5}')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]],
      dob: ['', [Validators.required, (control: AbstractControl) => {
        const now = new Date();
        const birth = new Date(Date.parse(control.value));

        let age = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
          --age;
        }

        return age >= 18 ? null : { dob: true };
      }]],
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

    this.authService.register(this.registrationForm.value).subscribe(
      () => this.router.navigate([ROUTE_PATHS.MAIN]),
      () => this.registrationForm.setErrors({ takenUsername: true }),
    )
  }

  fieldInvalid(fieldName: string) {
    return this.registrationForm.get(fieldName)?.invalid && this.registrationForm.get(fieldName)?.touched;
  }

}
