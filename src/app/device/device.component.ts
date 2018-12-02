import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { CapabilityIcon, ICON_LIST } from './device.icons';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';
import { MatSelectChange, MatSnackBar } from '@angular/material';
import { Device } from '../interfaces/device';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  addDeviceFormGroup: FormGroup;
  errorMessage: string;
  iconList: CapabilityIcon[] = ICON_LIST;
  capabilities: Capability[];
  deviceTypes: DeviceType[];
  devices: Device[];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private deviceService: DeviceService,
              private snackBar: MatSnackBar,
              private accountService: AccountService) { }

  ngOnInit() {
    this.addDeviceFormGroup = this.formBuilder.group({
      devName: ['', Validators.required],
      devType: ['', Validators.required],
      mainCapability: ['', Validators.required],
      capabilities: this.formBuilder.array([this.initItemRows()])
    });
    this.loadCapabilities();
    this.loadDeviceTypes();
    this.loadMyDevices();
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
        return this.router.navigate(['/home']);
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
}
