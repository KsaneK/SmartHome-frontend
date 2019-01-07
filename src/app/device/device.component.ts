import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { CapabilityIcon, ICON_LIST } from './device.icons';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';
import { MatSelectChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { Device } from '../interfaces/device';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit, OnDestroy {
  private user_status_sub: Subscription;
  private addDeviceFormGroup: FormGroup;
  private errorMessage: string;
  private iconList: CapabilityIcon[] = ICON_LIST;
  private capabilities: Capability[];
  private deviceTypes: DeviceType[];
  private devices: Device[];
  private subscription: Subscription;
  private capability_values: Map<string, any>;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private deviceService: DeviceService,
              private snackBar: MatSnackBar,
              private _mqttService: MqttService,
              private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.capability_values = new Map();
    this.user_status_sub = this.accountService.get_user_status().subscribe(res => {
      if (res && res.status !== 'authenticated') {
        this.router.navigate(['/account/login']);
      } else {
        this.loadCapabilities();
        this.loadDeviceTypes();
        this.loadMyDevices();
        console.log('/' + this.accountService.get_username() + '/#');
        this.subscription = this._mqttService.observe('/' + this.accountService.get_username() + '/#')
          .subscribe((message: IMqttMessage) => {
            const args: string[] = message.topic.split('/');
            const cap_slug: string = args[args.length - 2];
            let value;
            value = message.payload.toString();
            if (['false', 'true'].indexOf(message.payload.toString()) > -1) {
              value = 'true' === message.payload.toString();
            } else if (!isNaN(value)) {
              value = parseInt(message.payload.toString(), 10);
            }
            if (this.capability_values.has(cap_slug)) {
              console.log('Updated ' + cap_slug + ' component');
              this.capability_values.set(cap_slug, value);
            }
          });
      }
    });
    this.addDeviceFormGroup = this.formBuilder.group({
      devName: ['', Validators.required],
      devType: ['', Validators.required],
      mainCapability: ['', Validators.required],
      capabilities: this.formBuilder.array([this.initItemRows()])
    });
  }

  ngOnDestroy(): void {
    this.user_status_sub.unsubscribe();
    this.subscription.unsubscribe();
  }

  private initItemRows(): FormGroup {
    return this.formBuilder.group({
      capabilityName: ['', Validators.required],
      capabilityType: ['', Validators.required],
      capabilityIcon: ['']
    });
  }

  private addCapability() {
    const controls = <FormArray>this.addDeviceFormGroup.controls['capabilities'];
    controls.push(this.initItemRows());
  }

  private removeCapability(index: number): void {
    const control = <FormArray>this.addDeviceFormGroup.controls['capabilities'];
    control.removeAt(index);
  }

  private addDevice(): void {
    this.deviceService.add_device(this.addDeviceFormGroup).then(response => {
      if (response.status === 'success') {
        this.snackBar.open('Device created!', 'OK', {duration: 2000});
        return this.router.navigate(['/device/' + response.name]);
      } else {
        this.errorMessage = response.error;
      }
    }, err => {
      this.errorMessage = 'Service is unavailable';
    });
  }

  private loadCapabilities(): void {
    this.deviceService.get_capabilities().then(response => {
      this.capabilities = response;
    });
  }

  private loadDeviceTypes(): void {
    this.deviceService.get_device_types().then(response => {
      this.deviceTypes = response;
    });
  }

  private loadMyDevices(): void {
    this.deviceService.get_my_devices().then(response => {
      for (const dev of response) {
        this.capability_values.set(dev.slug, null);
      }
      this.devices = response;
    });
  }

  private areCapabilitiesUnique(): boolean {
    for (const capability1 of this.addDeviceFormGroup.controls.capabilities.value) {
      for (const capability2 of this.addDeviceFormGroup.controls.capabilities.value) {
        if (capability1 !== capability2 && capability1.capabilityName === capability2.capabilityName) {
          this.errorMessage = 'Capabilities must have unique names';
          return false;
        }
      }
    }
    this.errorMessage = '';
    return true;
  }

  pub_switch(event: MatSlideToggleChange, device: string, capability: string) {
    const topic: string = '/' + this.accountService.get_username() + '/' + device + '/' + capability;
    console.log(topic);
    this._mqttService.publish(topic, String(event.checked)).toPromise().then(res => {
      console.log(res);
    });
  }
}
