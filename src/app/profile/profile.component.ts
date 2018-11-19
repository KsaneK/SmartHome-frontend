import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from "../services/account.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private user_status_sub: Subscription;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.user_status_sub = this.accountService.get_user_status().subscribe(user_status => {
      if(user_status.status === "not_authenticated")
        this.router.navigate(['/home']);
    });
    this.route.params.subscribe(params => {
      if (params['tab'] == 'logout') {
        this.accountService.logout();
        this.snackBar.open("Logged out!", "OK", {duration: 2000});
        this.router.navigate(['/home']);
      }
    })
  }

  ngOnDestroy() {
    this.user_status_sub.unsubscribe();
  }
}
