import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { Device } from '../interfaces/device';
import { MatSliderChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-device-page',
  templateUrl: './device-page.component.html',
  styleUrls: ['./device-page.component.scss']
})
export class DevicePageComponent implements OnInit, OnDestroy {
  private user_status_sub: Subscription;
  private device: Device;
  private slug: string;
  private mqtt_topic: string;
  private capability_values: Map<string, any>;
  private subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private deviceService: DeviceService,
              private accountService: AccountService,
              private snackBar: MatSnackBar,
              private _mqttService: MqttService) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.user_status_sub = this.accountService.get_user_status().subscribe(res => {
      if (res && res.status !== 'authenticated') {
        this.router.navigate(['/account/login']);
      }
    });
    this.slug = this.route.snapshot.params['slug'];
    this.deviceService.get_device(this.slug).then(dev_response => {
      this.capability_values = new Map();
      this.capability_values.set(dev_response.mainCapability.name, dev_response.mainCapability.last_value);
      for (const cap of dev_response.capabilities) {
        this.capability_values.set(cap.name, cap.last_value);
      }
      this.device = dev_response;
      this.mqtt_topic = '/' + this.accountService.get_username() + '/' + this.device.slug;
      this.subscribe_capabilities();
    }, err => {
      this.snackBar.open('Device not found!', 'OK', {duration: 1000});
    });
  }

  ngOnDestroy(): void {
    this.user_status_sub.unsubscribe();
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  private copyToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copied!', 'OK', {duration: 1000});
  }

  private subscribe_capabilities() {
    console.log('subscribe'); console.log(this.mqtt_topic);
    this.subscription = this._mqttService.observe(this.mqtt_topic + '/#').subscribe((message: IMqttMessage) => {
      const args: string[] = message.topic.split('/');
      const cap_slug: string = args[args.length - 1];
      let value;
      value = message.payload.toString();
      if (['false', 'true'].indexOf(message.payload.toString()) > -1) {
        value = 'true' === message.payload.toString();
      } else if (!isNaN(value)) {
        value = parseInt(message.payload.toString(), 10);
      }
      this.capability_values.set(cap_slug, value);
    });
  }

  pub_switch(event: MatSlideToggleChange, capability: string) {
    console.log(this.mqtt_topic + '/' + capability);
    this._mqttService.publish(this.mqtt_topic + '/' + capability, String(event.checked)).toPromise().then(res =>{
      console.log(res);
    });
  }

  pub_slider(event: MatSliderChange, capability: string) {
    console.log(this.mqtt_topic + '/' + capability);
    console.log(event.value);
    this._mqttService.publish(this.mqtt_topic + '/' + capability, String(event.value)).toPromise().then(res =>{
      console.log(res);
    });
  }
}
