import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, LoadingController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { EditprofilePage } from '../pages/editprofile/editprofile.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [HttpClientModule,IonicModule,IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page implements OnInit {

  userid!: string;
  constructor(private modalController: ModalController,private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, private loadingCtrl: LoadingController) {}
  
  async ngOnInit(): Promise<void> {
    
      const storedToken = sessionStorage.getItem('authToken');
        if (!storedToken) {
          this.router.navigate(['/login']);
        } else {
          const decodedToken = jwt_decode.jwtDecode<any>(storedToken);
          this.userid = decodedToken.id;
          console.log(this.userid);
        }
        this.fetchUserData()
        
  }
  user:any={}
  async fetchUserData() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading', // Message shown in loader
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
    const apiUrl = `https://ionicservice.onrender.com/api/v1/auth/user/${this.userid}`;
    
    this.http.get(apiUrl).subscribe(
      async (data: any) => {
        if (data) {
          this.user = {
            username: data.username || "Add name",
            nickname: data.nickname || "Add nick name",
            email: data.email || "Add email",
            phone: data.phone || "Add phone",
            location: data.location || "Add location",
            profileimg:data.profileimg||"man.png"
          };

          this.cdr.detectChanges(); // Ensure UI updates after fetching data
          await loading.dismiss();
        }
      },
      async (error) => {
        console.error('Error fetching user data:', error);
        this.user = {
          name:  "John Doe",
          nickname:  "Add nick name",
          email:  "johndoe@example.com",
          phone:  "+91 98765 43210",
          location:  "Bangalore, India",
          profileimg:"man.png"
        };
        await loading.dismiss();
      }
    );
  }

  
  async editProfile() {
    const modal = await this.modalController.create({
      component: EditprofilePage,
      componentProps: { user: { ...this.user } } // Pass current user details
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.user = data; // Update user details with new data
      this.updateUserProfile(this.user)
    }
  }
  async updateUserProfile(updatedUser: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Updating', // Message shown in loader
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
    const apiUrl = `https://ionicservice.onrender.com/api/v1/auth/update/${this.userid}`;  // Your API endpoint

    this.http.post(apiUrl, updatedUser).subscribe({
      next: async (response) => {
        console.log('User updated successfully:', response);
        await loading.dismiss();
        // Optionally, show a success message to the user here
      },
      error: (err) => {
        console.error('Error updating user:', err);
        // Optionally, show an error message to the user here
      }
    });
  }
  async logout() {
    const loading = await this.loadingCtrl.create({
      message: 'Loging out', // Message shown in loader
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
    // Remove auth token from session storage
    sessionStorage.removeItem('authToken');

    // Optionally, clear any other user-related data from session storage
    sessionStorage.removeItem('user');

    // Redirect to login page
    this.router.navigate(['/login']);
    await loading.dismiss();
  
}
}
