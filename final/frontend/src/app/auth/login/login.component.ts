import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from 'src/app/constants';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
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

    this.authService.login(this.loginForm.value).subscribe(
      () => this.router.navigate([ROUTE_PATHS.MAIN]),
      () => this.loginForm.setErrors({ unknownUser: true }),
    )
  }

  fieldInvalid(fieldName: string) {
    return this.loginForm.get(fieldName)?.invalid && this.loginForm.get(fieldName)?.touched;
  }

}
