import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'day-modal',
    loadComponent: () => import('./pages/day-modal/day-modal.page').then( m => m.DayModalPage)
  },
  {
    path: 'editprofile',
    loadComponent: () => import('./pages/editprofile/editprofile.page').then( m => m.EditprofilePage)
  },
];
