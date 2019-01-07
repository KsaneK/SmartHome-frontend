import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { UserStatus } from '../interfaces/user-status';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  user: UserStatus;
  private subscription: Subscription;

  public ngOnInit() {
    this.subscription = this.accountService.get_user_status().subscribe(status => {
      this.user = status;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private accountService: AccountService) {}

}
