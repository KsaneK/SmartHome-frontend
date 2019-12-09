import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { CapabilityIcon, ICON_LIST } from './device.icons';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';
import { MatSliderChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { Device } from '../interfaces/device';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, OnDestroy {
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
    this.capability_values = new Map();

    this.loadCapabilities();
    this.loadDeviceTypes();
    this.loadMyDevices();
    this.subscription = this._mqttService.observe('/' + this.accountService.get_username() + '/#')
      .subscribe((message: IMqttMessage) => {
        const args: string[] = message.topic.split('/');
        const cap_slug: string = args[args.length - 2];
        const value = parseInt(message.payload.toString(), 10);
        console.log('Updated ' + cap_slug + ' component - value=' + value);
        this.capability_values.set(cap_slug, value);
      });

    this.addDeviceFormGroup = this.formBuilder.group({
      devName: ['', Validators.required],
      devType: ['', Validators.required],
      mainCapability: ['', Validators.required],
      capabilities: this.formBuilder.array([this.initItemRows()])
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      this.snackBar.open('Device created!', 'OK', {duration: 2000});
      console.log(response);
      return this.router.navigate([`/device/${response.slug}`]);
    }, err => {
      console.log(err);
      if (err.status === 400) {
        this.snackBar.open('Input structure is invalid', 'OK', {duration: 2000});
      } else if (err.status === 404) {
        this.snackBar.open('Service is not available', 'OK', {duration: 2000});
      } else if (err.status === 406) {
        this.snackBar.open('You already have device with this name', 'OK', {duration: 2000});
      }
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
        this.capability_values.set(dev.slug, dev.mainCapability.last_value);
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

  private deleteDevice(id: number) {
    this.deviceService.delete_device(id).then(() => {
      this.devices = this.devices.filter(d => d.id !== id);
      this.snackBar.open('Device deleted!', 'OK', {duration: 2000});
    }, err => {
      this.snackBar.open('Error while deleting device', 'OK', {duration: 2000});
    });
  }

  private pub_switch(event: MatSlideToggleChange, device: string, capability: string) {
    const topic: string = '/' + this.accountService.get_username() + '/' + device + '/' + capability;
    this.deviceService.publish_status(topic, event.checked.valueOf() ? 1 : 0).then(() => {
      console.log('Published ' + event.checked.valueOf() + ' to ' + topic);
    });
  }

  private pub_slider(event: MatSliderChange, device: string, capability: string) {
    const topic: string = '/' + this.accountService.get_username() + '/' + device + '/' + capability;
    this.deviceService.publish_status(topic, event.value).then(() => {
      console.log('Published ' + String(event.value) + ' to ' + topic);
    });
  }
}
