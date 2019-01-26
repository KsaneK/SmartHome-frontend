import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { Subscription } from 'rxjs';
import { UserStatus } from './interfaces/user-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private user: UserStatus;
  private subscription: Subscription;

  constructor(private accountService: AccountService) {}

  title = 'smart-home';
  nightmode = false;
  public ngOnInit() {
    this.accountService.refresh_user_status();
    this.subscription = this.accountService.get_user_status().subscribe(status => {
      this.user = status;
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  changeTheme() {
    this.nightmode = !this.nightmode;
  }
}
