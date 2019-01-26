import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AirQualityResponse } from '../interfaces/air-quality-response';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyService {

  constructor(private http: HttpClient) { }

  public getAirQualityIndex(): Promise<AirQualityResponse> {
    return this.http.get<AirQualityResponse>('/api/cron/latest').toPromise();
  }
}
