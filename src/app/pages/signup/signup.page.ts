import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController, IonItem, LoadingController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [HttpClientModule, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class SignupPage {
  signupData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController // Inject LoadingController
  ) {}

  async onSubmit() {
    // Email Validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.signupData.email)) {
      alert('Invalid email format. Please enter a valid email address.');
      return;
    }

    // Password Validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordPattern.test(this.signupData.password)) {
      alert('Password must be at least 8 characters long and contain both letters, numbers, and special characters.');
      return;
    }

    // Show Loader
    const loading = await this.loadingCtrl.create({
      message: 'Signing up...', // Loader message
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec) in case request takes too long
    });

    await loading.present(); // Show loader

    const signupPayload = {
      username: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password
    };

    this.http.post<any>('https://ionicservice.onrender.com/api/v1/auth/signup', signupPayload)
      .subscribe({
        next: async (response) => {
          console.log('Signup successful', response);
          
          // ✅ Hide Loader
          await loading.dismiss();

          // ✅ Redirect to Login Page
          this.router.navigate(['/login']);
        },
        error: async (err) => {
          console.error('Signup error', err);

          // ❌ Hide Loader
          await loading.dismiss();

          // ❌ Show error message
          alert('Signup failed! Please try again.');
        }
      });
  }

  login() {
    this.navCtrl.navigateForward('login');
  }
}
