import { Component, OnInit } from '@angular/core';
import { AccountService } from "./services/account.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public ngOnInit() {
    this.accountService.refresh_user_status();
  }

  constructor(private accountService: AccountService) {}

  title = 'smart-home';
}
