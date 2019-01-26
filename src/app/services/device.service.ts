import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';
import { Device } from '../interfaces/device';
import { DeviceAction } from '../interfaces/device-action';
import { AddDeviceResponse } from '../interfaces/add-device-response';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  public add_device(form: FormGroup): Promise<AddDeviceResponse> {

    const formData = JSON.stringify({
      devName: form.controls.devName.value,
      devType: form.controls.devType.value,
      mainCapability: form.controls.mainCapability.value,
      capabilities: form.controls.capabilities.value
    });
    console.log(formData);

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<AddDeviceResponse>('/api/device/add', formData, {headers: headers}).toPromise();
  }

  public get_capabilities(): Promise<Capability[]> {
    return this.http.get<Capability[]>('/api/device/capabilities').toPromise();
  }

  public get_device_types(): Promise<DeviceType[]> {
    return this.http.get<DeviceType[]>('/api/device/types').toPromise();
  }

  public get_my_devices(): Promise<Device[]> {
    return this.http.get<Device[]>('/api/device/get').toPromise();
  }

  public get_device(slug: string) {
    return this.http.get<Device>('/api/device/get/' + slug).toPromise();
  }

  public add_action(deviceAction: DeviceAction): Promise<Object> {
    console.log(deviceAction);
    const requestData = {
      condition_device: deviceAction.condition_device,
      condition_capability: deviceAction.condition_capability.name,
      condition: deviceAction.condition,
      condition_value: deviceAction.condition_value,
      action_device: deviceAction.action_device,
      action_capability: deviceAction.action_capability.name,
      action_value: deviceAction.action_capability_value
    };
    console.log(requestData);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Response>('/api/device/add_action', JSON.stringify(requestData), {headers: headers}).toPromise();
  }

  public get_actions(): Promise<DeviceAction[]> {
    return this.http.get<DeviceAction[]>('/api/device/get_actions').toPromise();
  }
}
