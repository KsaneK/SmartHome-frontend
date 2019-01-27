import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AirQualityResponse } from '../interfaces/air-quality-response';
import { ThirdPartyService } from '../services/third-party.service';
import { WeatherResponse } from '../interfaces/weather-response';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('fullpageRef') fp_directive: ElementRef;
  private fullpage_api: any;
  private config: any;
  private user_sub: Subscription;
  private status: string;
  private airQuality: AirQualityResponse;
  private currentWeather: WeatherResponse;

  constructor(private accountService: AccountService,
              private thirdPartyService: ThirdPartyService) {
    this.config = {
      licenseKey: null,
      anchors: ['main', 'add-device', 'show-devices', 'control-device'],
      menu: '#menu',
      controlArrows: true,
      loopHorizontal: false,
      dragAndMove: true,
      navigation: true,
    };
  }

  getRef(fullPageRef) {
    this.fullpage_api = fullPageRef;
  }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.user_sub = this.accountService.get_user_status().subscribe(e => {
      this.status = e.status;
      if (this.status === 'authenticated') {
        this.thirdPartyService.getAirQualityIndex().then(q => {
          this.airQuality = q;
        });
      } else {
        document.getElementsByClassName('mat-sidenav-content').item(0)
          .setAttribute('style', 'overflow: hidden;');
      }
    });
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe();
    document.getElementsByClassName('mat-sidenav-content').item(0)
      .setAttribute('style', 'overflow: auto;');
  }

}
