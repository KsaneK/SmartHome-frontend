import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { SignUpResponse } from '../interfaces/sign-up-response';
import { Observable } from 'rxjs/internal/Observable';
import { UserStatus } from '../interfaces/user-status';
import { Subject } from 'rxjs/internal/Subject';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user_subject: Subject<any> = new Subject<any>();
  username: string;

  constructor(private http: HttpClient) {}

  public create_account(form: FormGroup): Promise<SignUpResponse> {
    const params = new HttpParams()
      .set('username', form.value.username)
      .set('password1', form.value.password1)
      .set('password2', form.value.password2)
      .set('email', form.value.email);
    return this.http.post<SignUpResponse>('/api/account/create', params).toPromise();
  }

  public refresh_user_status(): void {
    this.http.get<UserStatus>('/api/account/status').toPromise().then(status => {
      this.user_subject.next(status);
      if (status.status === 'authenticated') {
        this.username = status.username;
      }
    }, err => {
      console.log('Backend not responding.');
    });
  }

  public logout(): void {
    this.http.get('/api/account/logout').subscribe(response => {
      this.user_subject.next({status: 'not_authenticated'});
    });
  }

  public get_user_status(): Observable<UserStatus> {
    return this.user_subject.asObservable();
  }

  public login(loginForm: FormGroup): Promise<LoginResponse> {
    const params = new HttpParams()
      .set('username', loginForm.value.username)
      .set('password', loginForm.value.password);
    return this.http.post<LoginResponse>('/api/account/login', params).toPromise();
  }

  public get_username(): string {
    return this.username;
  }

  public get_email() {
    return this.http.get('/api/account/email').toPromise();
  }

  public get_telegram_config() {
    return this.http.get('/api/account/telegram_config/get').toPromise();
  }

  public put_telegram_token(token) {
    const formData = JSON.stringify({
      token: token
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/telegram_token/put', formData, {headers: headers}).toPromise();
  }

  public connect_telegram() {
    return this.http.get('/api/account/telegram_connect').toPromise();
  }

  public update_email(email) {
    const formData = JSON.stringify({
      email: email
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/email/put', formData, {headers: headers}).toPromise();
  }

  public update_telegram_notification(notify: any) {
    const formData = JSON.stringify({
      notify: notify
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('api/account/telegram_notification/put', formData, {headers: headers}).toPromise();
  }

  public update_email_notification(notify: any) {
    const formData = JSON.stringify({
      notify: notify
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('api/account/email_notification/put', formData, {headers: headers}).toPromise();
  }
}
