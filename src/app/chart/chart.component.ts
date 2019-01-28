import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceHistoryResponse } from '../interfaces/device-history-response';
import { Chart } from 'chart.js';
import { DeviceService } from '../services/device.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  private chart: Chart;
  private device: string;
  private capability: string;
  private user_status_sub: Subscription;
  private dates: string[];
  private values: number[];

  constructor(private deviceSerice: DeviceService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.user_status_sub = this.accountService.get_user_status().subscribe(res => {
      if (res && res.status !== 'authenticated') {
        this.router.navigate(['/account/login']);
      }
    });

    let response: DeviceHistoryResponse[];
    this.route.params.subscribe(params => {
      this.device = params['device'];
      this.capability = params['capability'];
    });
    this.deviceSerice.get_historical_data(this.device, this.capability).then(r => {
      response = r;
      this.dates = response.map(data => data.date.toString());
      this.values = response.map(data => data.value);

      this.chart = new Chart('chart-canvas', {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              data: this.values,
              borderColor: '#D8C9FD',
              fill: false
            },
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              }
            }],
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.user_status_sub.unsubscribe();
  }
}
