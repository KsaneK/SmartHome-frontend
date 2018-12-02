import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { AddDeviceResponse } from '../interfaces/add-device-response';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  public add_device(form: FormGroup): Promise<AddDeviceResponse> {

    const formData = JSON.stringify({
      devName: form.controls.devName.value,
      devType: form.controls.devType.value,
      capabilities: form.controls.capabilities.value
    });
    console.log(formData);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<AddDeviceResponse>('/api/device/add', formData, {headers: headers}).toPromise();
  }

  public get_capabilities(): Promise<Capability[]> {
    return this.http.get<Capability[]>('/api/device/capabilities').toPromise();
  }

  public get_device_types(): Promise<DeviceType[]> {
    return this.http.get<DeviceType[]>('/api/device/types').toPromise();
  }
}
