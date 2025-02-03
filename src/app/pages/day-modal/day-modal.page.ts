import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonItem, LoadingController } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-day-modal',
  templateUrl: './day-modal.page.html',
  styleUrls: ['./day-modal.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonicModule]
})
export class DayModalPage  {
  @Input() day!: number;
  @Input() month!: number;
  @Input() year!: number;
  @Input() val!: number;
  userid!: string;
  items: { itemname: string; amount: number }[] = [];
  newitemname: string = '';
  newitemamount: number = 0;
  dateStr!: string;
  
  constructor(private modalController: ModalController, private http: HttpClient,private router: Router,private loadingCtrl: LoadingController) {}

  ngOnInit() {
    const storedToken = sessionStorage.getItem('authToken');
        if (!storedToken) {
          this.router.navigate(['/login']);
        } else {
          const decodedToken = jwt_decode.jwtDecode<any>(storedToken);
          this.userid = decodedToken.id;
          console.log(this.userid);
        }
    this.dateStr = new Date(this.year, this.month, this.day).toISOString().split('T')[0];  // Format date to YYYY-MM-DD
    this.fetchItems();
  }

  async fetchItems(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Loading', // Message shown in loader
      spinner: 'bubbles', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
    // Convert dateStr to a Date object if it's a string
    const dateObj = new Date(this.dateStr);  // Assuming this.dateStr is a string

    // Add 1 day to the date
    dateObj.setDate(dateObj.getDate() + 1);

    // Ensure the date string is properly formatted to 'YYYY-MM-DD'
    const formattedDate = dateObj.toISOString().split('T')[0];  // Convert to YYYY-MM-DD format

    // Fetch the list of items and total value from the API
    this.http.get<any>(`https://ionicservice-1.onrender.com/api/v1/transaction/${this.userid}/${formattedDate}`)
      .subscribe(async data => {
        this.items = data.items || [];  // Update the list of items
        this.val = data.amount || 0;    // Update total expenditure
        await loading.dismiss();
      }, error => {
        console.error('Error fetching items:', error);
      });
}

  
  

async onAddItem(): Promise<void> {
  if (this.newitemname && this.newitemamount > 0) {
    const loading = await this.loadingCtrl.create({
      message: 'Adding', // Message shown in loader
      spinner: 'bubbles', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
      // Convert dateStr to a Date object
      const dateObj = new Date(this.dateStr);
      dateObj.setDate(dateObj.getDate() + 1);
      // Ensure the date is formatted as 'YYYY-MM-DD'
      const formattedDate = dateObj.toISOString().split('T')[0];

      const data = {
          date: formattedDate,
          itemname: this.newitemname,
          amount: this.newitemamount,
          userid: this.userid
      };

      // Clear input fields before making the request
      this.newitemname = '';
      this.newitemamount = 0;

      this.http.post('https://ionicservice-1.onrender.com/api/v1/transcation', data)
          .subscribe(async () => {
              this.fetchItems(); // Refresh the item list
              await loading.dismiss();
          });
  }
}


  async onDeleteItem(itemname: string): Promise<void> {
  // Convert dateStr to a Date object
  const loading = await this.loadingCtrl.create({
    message: 'Deleting', // Message shown in loader
    spinner: 'bubbles', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
    duration: 10000 // Maximum timeout (10 sec), in case request takes too long
  });
  await loading.present();
  const dateObj = new Date(this.dateStr);
  dateObj.setDate(dateObj.getDate() + 1);
  // Ensure the date is formatted as 'YYYY-MM-DD'
  const formattedDate = dateObj.toISOString().split('T')[0];

  this.http.delete(`https://ionicservice-1.onrender.com/api/v1/transaction/delete-item/${this.userid}/${formattedDate}/${itemname}`)
      .subscribe(async () => {
          this.fetchItems();  // Refresh item list after deletion
          await loading.present();
      });
}

  closeModal() {
    this.modalController.dismiss();  // Close the modal
  }
  // items: { itemname: string; amount: number }[] = [];
  // newItemName: string = '';
  // newItemAmount: number = 0;
  // curval: number = 0;
  // dateStr!: string;

  // constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  // ngOnInit(): void {
  //   this.dateStr = new Date(this.year, this.month, this.day + 1).toISOString().split('T')[0];
  //   this.curval = this.val;
  //   this.fetchItems();
  // }

  // fetchItems(): void {
  //   this.http.get<any>(`https://transcation-xa5b.onrender.com/api/v1/transaction/${this.userid}/${this.dateStr}`)
  //     .subscribe(data => {
  //       this.items = data.items || [];
  //       this.curval = data.amount || 0;
  //     });
  // }

  // addItem(): void {
  //   if (this.newItemName && this.newItemAmount > 0) {
  //     const data = {
  //       date: this.dateStr,
  //       itemname: this.newItemName,
  //       amount: this.newItemAmount,
  //       userid: this.userid,
  //     };

  //     this.http.post('https://transcation-xa5b.onrender.com/api/v1/transcation', data)
  //       .subscribe(() => {
  //         this.newItemAmount = 0;
  //         this.newItemName = '';
  //         this.fetchItems();
  //       });
  //   }
  // }

  // deleteItem(itemname: string): void {
  //   this.http.delete(`https://transcation-xa5b.onrender.com/api/v1/transaction/delete-item/${this.userid}/${this.dateStr}/${itemname}`)
  //     .subscribe(() => {
  //       this.fetchItems();
  //     });
  // }

  // close(): void {
  //   this.modalCtrl.dismiss();
  // }
}
