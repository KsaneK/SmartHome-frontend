import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { DeviceComponent } from './device/device.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { ActionComponent } from './action/action.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'account/:tab', component: AccountComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/:tab', component: ProfileComponent},
  {path: 'devices', component: DeviceComponent},
  {path: 'device/:slug', component: DevicePageComponent},
  {path: 'device/:name', component: DeviceComponent},
  {path: 'actions', component: ActionComponent},
  {path: 'chart/:device/:capability', component: ChartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
