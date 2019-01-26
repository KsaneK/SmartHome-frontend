import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Device } from '../interfaces/device';
import { MatSnackBar } from '@angular/material';
import { Capability } from '../interfaces/capability';
import { DeviceAction } from '../interfaces/device-action';
import strToSignMap from './maps';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  // For add action section
  private devices: Device[];
  private capabilities: Capability[];
  private actionCapabilities: Capability[];
  private newAction: DeviceAction = <DeviceAction>{};
  private isActionBinary = false;
  private strToSignMap = strToSignMap;

  // For device action list
  private deviceActions: DeviceAction[];

  constructor(private deviceService: DeviceService,
              private accountService: AccountService,
              private router: Router,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.subscription = this.accountService.get_user_status().subscribe( e => {
      if (e.status !== 'authenticated') {
        this.router.navigate(['/home']);
      } else {
        console.log('Getting devices');
        this.deviceService.get_my_devices().then(r => {
          this.devices = r;
        }, err => {
          this.snackBar.open('Couldn\'t load devices', 'OK', {duration: 2000});
        });
        console.log('Getting actions');
        this.deviceService.get_actions().then(r => {
          this.deviceActions = r;
        }, err => {
          this.snackBar.open('Couldn\'t load actions', 'OK', {duration: 2000});
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private selectDevice(device: Device) {
    console.log(device);
    this.capabilities = [];
    this.capabilities.push(device.mainCapability);
    device.capabilities.forEach(c => this.capabilities.push(c));
    this.newAction.condition_device = device.slug;
    this.newAction.condition_capability = null;
  }

  private selectCapability(capability: Capability) {
    console.log(capability);
    this.newAction.condition_capability = capability;
    if (['switch', 'icon'].indexOf(this.newAction.condition_capability.component) !== -1) {
      this.newAction.condition = 'eq';
    }
  }

  private selectCondition(condition: string) {
    console.log(condition);
    this.newAction.condition = condition;
  }

  private selectValue(value: number) {
    console.log(value);
    this.newAction.condition_value = value;
  }

  private selectActionDevice(device: Device) {
    console.log(device);
    this.actionCapabilities = [];
    if (device.mainCapability.type === 'set') { this.actionCapabilities.push(device.mainCapability); }
    device.capabilities.filter(c => c.type === 'set')
      .forEach(c => this.actionCapabilities.push(c));
    this.newAction.action_device = device.slug;
    this.newAction.action_capability = null;
  }

  private selectActionCapability(capability: Capability) {
    console.log(capability);
    this.newAction.action_capability = capability;
    this.isActionBinary = ['switch', 'icon'].indexOf(capability.component) !== -1;
    console.log(this.isActionBinary, capability.component);
  }

  private selectActionValue(value: number) {
    console.log(value);
    this.newAction.action_capability_value = value;
  }

  private addDeviceAction() {
    console.log(JSON.stringify(this.newAction));
    this.deviceService.add_action(this.newAction).then(response => {
      this.snackBar.open('Action created!', 'OK', {duration: 2000});
      this.deviceActions.push(<DeviceAction>{
        action_device: this.newAction.action_device,
        condition_device: this.newAction.condition_device,
        condition_value: this.newAction.condition_value,
        condition: this.newAction.condition,
        condition_capability: this.clone_capability(this.newAction.condition_capability),
        action_capability_value: this.newAction.action_capability_value,
        action_capability: this.clone_capability(this.newAction.action_capability)
      });
    }, error => {
      if (error.status === 400) {
        this.snackBar.open('Invalid data. Make sure you filled all fields', 'OK', {duration: 2000});
      } else if (error.status === 406) {
        this.snackBar.open('Couldn\'t find selected capability. Contact with administrator.' , 'OK', {duration: 2000});
      } else {
        console.log(error);
      }
    });
  }

  private clone_capability(capability: Capability): Capability {
    return <Capability>{
      id: capability.id,
      component: capability.component,
      type: capability.type,
      label: capability.label,
      name: capability.name,
      icon: capability.icon
    };
  }
}
