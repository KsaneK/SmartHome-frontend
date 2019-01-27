import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private user_status_sub: Subscription;
  private token_field: any;
  private email_field: any;
  private telegram_notification_field: any;
  private email_notification_field: any;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.route.params.subscribe(params => {
      if (params['tab'] === 'logout') {
        this.accountService.logout();
        this.snackBar.open('Logged out!', 'OK', {duration: 2000});
        this.router.navigate(['/home']);
      }
    });
    this.user_status_sub = this.accountService.get_user_status().subscribe(user_status => {
      if (user_status.status === 'not_authenticated') {
        this.router.navigate(['/home']);
      } else {
        this.accountService.get_email().then(e => {
          this.email_field = e['email'];
          this.email_notification_field = e['notify'];
        }, err => {
          console.log('error while getting email.');
          console.log(err);
        });
        this.accountService.get_telegram_config().then(e => {
          this.token_field = e['token'];
          this.telegram_notification_field = e['notify'];
        }, err => {
          console.log('error while getting token.');
          console.log(err);
        });
      }
    });
  }

  ngOnDestroy() {
    this.user_status_sub.unsubscribe();
  }

  updateToken() {
    this.accountService.put_telegram_token(this.token_field).then(response => {
      this.snackBar.open('Successfully updated telegram token!', 'OK', {duration: 2000});
    }, err => {
      this.snackBar.open('Couldn\'t update telegram token. Check if token is correct.', 'OK', {duration: 2000});
    });
    console.log(this.token_field);
  }

  connectTelegram() {
    this.accountService.connect_telegram().then(r => {
      this.snackBar.open('Successfully connected telegram!', 'OK', {duration: 2000});
    }, err => {
      if (err.status === 400) {
        this.snackBar.open('Unexpected error while connecting telegram!', 'OK', {duration: 2000});
      } else if (err.status === 404) {
        this.snackBar.open('Couldn\'t find message /smarthome. Are you sure you wrote to the bot?', 'OK', {duration: 2000});
      }
    });
  }

  updateEmail() {
    this.accountService.update_email(this.email_field).then(r => {
      this.snackBar.open('Successfully updated email!', 'OK', {duration: 2000});
    }, err => {
      this.snackBar.open('Error while updating email. Check your email and try again.', 'OK', {duration: 2000});
    });
  }

  updateTelegramNotification() {
    this.accountService.update_telegram_notification(this.telegram_notification_field).then(r => {
      this.snackBar.open('Successfully updated notification setting.', 'OK', {duration: 2000});
    }, err => {
      this.snackBar.open('Couldn\'t update notification setting', 'OK', {duration: 2000});
    });
  }

  updateEmailNotification() {
    this.accountService.update_email_notification(this.email_notification_field).then(r => {
      this.snackBar.open('Successfully updated notification setting.', 'OK', {duration: 2000});
    }, err => {
      this.snackBar.open('Couldn\'t update notification setting', 'OK', {duration: 2000});
    });
  }
}
