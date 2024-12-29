import { Component } from '@angular/core';
import { API_URL } from '../constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  googleLogin() {
    window.open(`${API_URL}/auth/google`, '_self');
  }

}
