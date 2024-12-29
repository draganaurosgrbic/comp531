import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PATHS } from './constants';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: ROUTE_PATHS.LANDING,
    component: LandingComponent,
  },
  {
    path: ROUTE_PATHS.MAIN,
    component: MainComponent,
  },
  {
    path: ROUTE_PATHS.PROFILE,
    component: ProfileComponent,
  },
  {
    path: ROUTE_PATHS.LOGIN,
    component: LoginComponent,
  },
  {
    path: ROUTE_PATHS.OTHER,
    pathMatch: 'full',
    redirectTo: ROUTE_PATHS.LANDING,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
