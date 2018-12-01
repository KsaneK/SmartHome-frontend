import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capability } from '../interfaces/capability';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  addDeviceBasicFormGroup: FormGroup;
  capabilities: Capability[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addDeviceBasicFormGroup = this.formBuilder.group({
      devName: ['', Validators.required],
      devType: ['', Validators.required]
    });
  }

}
