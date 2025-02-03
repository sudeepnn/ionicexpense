import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ChartData, ChartOptions } from 'chart.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import {   IonButton } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; 
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [HttpClientModule, NgChartsModule, CommonModule, IonicModule, ExploreContainerComponent],
})
export class Tab1Page implements OnInit {
  userid!: string;
  monthlyExpenditures: number[] = [];
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Expenditure',
        data: this.monthlyExpenditures,
        fill: false,
        backgroundColor: '#92a7fd',
        tension: 0.1,
        hoverBackgroundColor: '#92a7fd',
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Expenditure (in INR)',
        },
        beginAtZero: true,
      },
    },
  };

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedToken = sessionStorage.getItem('authToken');
    if (!storedToken) {
      this.router.navigate(['/login']);
    } else {
      const decodedToken = jwt_decode.jwtDecode<any>(storedToken);
      this.userid = decodedToken.id;
      console.log(this.userid);
    }

    this.fetchMonthlyExpenditure();
  }

  fetchMonthlyExpenditure() {
    this.http.get<any>(`https://ionicservice-1.onrender.com/api/v1/expenses/monthly/${this.userid}`).subscribe(
      (response) => {
        console.log(response.monthlyExpenditures);
        this.monthlyExpenditures = response.monthlyExpenditures;
        this.chartData.datasets[0].data = this.monthlyExpenditures;
        this.chartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Manually trigger change detection to update the chart
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching monthly expenditure data', error);
      }
    );
  }

  navigateToExpense() {
    this.router.navigate(['/expense']);
  }
}
