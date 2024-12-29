import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from 'src/app/constants';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    });
  };

  loginForm: FormGroup;

  get formInvalid() {
    return this.loginForm.hasError('unknownUser');
  }

  login() {
    if (!this.loginForm.valid) {
      for (const fieldName in this.loginForm.controls) {
        this.loginForm.get(fieldName)?.markAsTouched();
      }
      return;
    }
    this.userService.login(this.loginForm.value);
    if (this.userService.profile) {
      this.router.navigate([ROUTE_PATHS.MAIN]);
    } else {
      this.loginForm.setErrors({ unknownUser: true });
    }
  }

  fieldInvalid(fieldName: string) {
    return this.loginForm.get(fieldName)?.invalid && this.loginForm.get(fieldName)?.touched;
  }

}
