import { Component, NgModule, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import {
  IMqttMessage,
  MqttService
} from 'ngx-mqtt';
import { Subscription } from "rxjs/internal/Subscription";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private subscription: Subscription;
  private temperature: string;
  private window_status: string;


  constructor(private accountService: AccountService,
              private _mqttService: MqttService) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.subscription = this._mqttService.observe('Termometr').subscribe((message: IMqttMessage) => {
      this.temperature = message.payload.toString();
    });
    this.subscription = this._mqttService.observe('window/open').subscribe((message: IMqttMessage) => {
      console.log(message);
      this.window_status = (message.payload.toString() == "1") ? "otwarte" : "zamknięte";
    });
  }

}
