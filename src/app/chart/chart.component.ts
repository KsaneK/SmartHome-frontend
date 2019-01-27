import { Component, OnInit } from '@angular/core';
import { DeviceHistoryResponse } from '../interfaces/device-history-response';
import { Chart } from 'chart.js';
import { DeviceService } from '../services/device.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private chart: Chart;
  private device: string;
  private capability: string;

  constructor(private deviceSerice: DeviceService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let response: DeviceHistoryResponse[];
    this.route.params.subscribe(params => {
      this.device = params['device'];
      this.capability = params['capability'];
    });
    this.deviceSerice.get_historical_data(this.device, this.capability).then(r => {
      response = r;
      const dates: string[] = response.map(data => data.date.toString());
      const values: number[] = response.map(data => data.value);

      this.chart = new Chart('chart-canvas', {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              data: values,
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


}
