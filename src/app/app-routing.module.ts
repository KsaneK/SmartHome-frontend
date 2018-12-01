import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { DeviceComponent } from './device/device.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'account/:tab', component: AccountComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/:tab', component: ProfileComponent},
  {path: 'devices', component: DeviceComponent},
  {path: 'device/add', component: DeviceComponent},
  {path: 'device/:name', component: DeviceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
