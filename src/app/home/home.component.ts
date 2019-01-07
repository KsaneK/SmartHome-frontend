import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import {
  IMqttMessage,
  MqttService
} from 'ngx-mqtt';
import { Subscription } from 'rxjs/internal/Subscription';
import { EOVERFLOW } from 'constants';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('fullpageRef') fp_directive: ElementRef;
  private fullpage_api: any;
  private config: any;

  constructor(private accountService: AccountService) {
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
    document.getElementsByClassName('mat-sidenav-content').item(0)
      .setAttribute('style', 'overflow: hidden;');
  }

  ngOnDestroy(): void {
    document.getElementsByClassName('mat-sidenav-content').item(0)
      .setAttribute('style', 'overflow: scroll;');
  }

}
