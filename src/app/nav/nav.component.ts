import { Component, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { UserStatus } from "../interfaces/user-status";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: UserStatus;

  public ngOnInit() {
    this.accountService.get_user_status().subscribe(status => {
      this.user = status;
    });
  }

  constructor(private accountService: AccountService) {}

}
