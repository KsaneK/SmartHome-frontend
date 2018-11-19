import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AccountService } from "./services/account.service";
import { ProfileComponent } from './profile/profile.component';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { DeviceComponent } from './device/device.component';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 1884,
  path: '',
  protocol: 'ws',
  rejectUnauthorized: false
};

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'account/:tab', component: AccountComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/:tab', component: ProfileComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AccountComponent,
    ProfileComponent,
    DeviceComponent
  ],
  imports: [
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AccountService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
