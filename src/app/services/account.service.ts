import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from "@angular/forms";
import { SignUpResponse } from "../interfaces/sign-up-response";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private ENDPOINTS = {
    CREATE_ACCOUNT: '/account/create',
    LOGIN: '/account/login'
  };

  constructor(private http: HttpClient) {
  }

  public create_account(form: FormGroup): Observable<SignUpResponse> {
    let params = new HttpParams()
      .set('username', form.value.username)
      .set('password1', form.value.password1)
      .set('password2', form.value.password2)
      .set('email', form.value.email);
    return this.http.post<SignUpResponse>("/api/account/create", params);
  }
}
