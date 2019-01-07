import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
}
