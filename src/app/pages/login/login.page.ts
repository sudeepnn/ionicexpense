import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController, IonItem, LoadingController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [HttpClientModule, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController // Inject LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    // Show Loader
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...', // Message shown in loader
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present(); // Display the loader

    this.http.post<any>('https://ionicservice.onrender.com/api/v1/auth/login', loginData)
      .subscribe({
        next: async (response) => {
          console.log('Login successful:', response);

          // ✅ Store the JWT token in session storage
          const responseToken = response.token;
          sessionStorage.setItem('authToken', responseToken);

          // ✅ Hide the loader after successful login
          await loading.dismiss();

          // ✅ Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: async (error) => {
          console.error('Login failed:', error);

          // ❌ Hide the loader if login fails
          await loading.dismiss();

          // ❌ Optionally, show an error message to the user
          alert('Login failed! Please check your credentials.');
        }
      });
  }

  signup() {
    this.navCtrl.navigateForward('signup');
  }
}
