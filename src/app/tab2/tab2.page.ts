import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, ModalController} from '@ionic/angular'; // Change this import
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { DayModalPage } from '../pages/day-modal/day-modal.page';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoadingController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonicModule, CommonModule, HttpClientModule] // Removed standalone imports
})
export class Tab2Page implements OnInit {
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysInMonth: number[] = [];
  selectedMonth: number = this.currentMonth;
  selectedYear: number = this.currentYear;
  transactions: { date: string, amount: number }[] = [];
  transactionsForDay: { [key: number]: number } = {};
  userid!: string;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient,
     private router: Router,private modalController: ModalController, private loadingCtrl: LoadingController) {}
     
     
  ngOnInit(): void {
    const storedToken = sessionStorage.getItem('authToken');
    if (!storedToken) {
      this.router.navigate(['/login']);
    } else {
      const decodedToken = jwt_decode.jwtDecode<any>(storedToken);
      this.userid = decodedToken.id;
    }

    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.fetchTransactions();
  }

  async fetchTransactions(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Featching Transcation', // Message shown in loader
      spinner: 'crescent', // Loader type: 'bubbles', 'circles', 'crescent', 'dots'
      duration: 10000 // Maximum timeout (10 sec), in case request takes too long
    });

    await loading.present();
    this.http.get<{ date: string, amount: number }[]>(`https://ionicservice-1.onrender.com/api/v1/transcation/user/${this.userid}`)
      .subscribe(async data => {
        this.transactions = data;
        await loading.dismiss();
        this.updateTransactionsForMonth();
      });
  }

  updateTransactionsForMonth(): void {
    this.transactionsForDay = {};

    this.transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === this.selectedYear && transactionDate.getMonth() === this.selectedMonth) {
        this.transactionsForDay[transactionDate.getDate()] = transaction.amount;
      }
    });

    this.cdr.detectChanges();
  }

  generateCalendar(month: number, year: number): void {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const daysArray = new Array(firstDayOfWeek).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.daysInMonth = daysArray;
  }

  prevMonth(): void {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();
  }

  nextMonth(): void {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateCalendar(this.selectedMonth, this.selectedYear);
    this.updateTransactionsForMonth();
  }

  async openDayModal(day: number, month: number, year: number, val: number): Promise<void> {
    const modal = await this.modalController.create({
      component: DayModalPage,
      componentProps: {
        day: day,
        month: month,
        year: year,
        val: val
      }
    });
    modal.onDidDismiss().then(() => {
      this.refreshTab2();
    });

    return await modal.present(); // Show the modal
  }
  refreshTab2() {
    // Your logic to refresh Tab2 data
    this.fetchTransactions(); // Example: Call your API again
  }

  navigateTodashboard() {
    this.router.navigate(['/dashboard']);
  }
}
