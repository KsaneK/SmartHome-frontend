import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "../services/account.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  /**
   * Selected tab index (0 - register, 1 - login, 2 - forgot-password)
   */
  private selectedIndex: int;

  private loginForm: FormGroup;
  private loginError: string;
  private signUpForm: FormGroup;
  private signUpErrors = {username: [], password1: [], password2: [], email: []};

  forms = {
    "register": 0,
    "login": 1,
    "forgot-password": 2
  };
  private user_status_sub: Subscription;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.accountService.refresh_user_status();
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.user_status_sub = this.accountService.get_user_status().subscribe(res => {
      if (res && res.status === "authenticated") {
        this.router.navigate(['/home'])
      }
    });

    this.route.params.subscribe(params => {
      this.selectedIndex = this.forms[params['tab']];
    });
  }

  ngOnDestroy() {
    this.user_status_sub.unsubscribe();
  }

  private update_route(tabChangeEvent: MatTabChangeEvent) {
    let tab = tabChangeEvent.tab.textLabel.toLowerCase().replace(" ", "-");
    this.router.navigate(['/account', tab]);
  }


  private register_account() {
    this.accountService.create_account(this.signUpForm).subscribe(response => {
      this.snackBar.open("Account created!", "OK", {duration: 2000});
      return this.router.navigate(['/home']);
    }, err => {
      this.signUpErrors.username = [];
      this.signUpErrors.email = [];
      this.signUpErrors.password1 = [];
      this.signUpErrors.password2 = [];
      if (err.status == 404) {
        this.signUpErrors.password2.push("Service is unavailable.");
        return;
      }
      for (const [key, value] of Object.entries(err.error.errors)) this.signUpErrors[key].push(value)
    });
  }

  private login() {
    this.accountService.login(this.loginForm).subscribe(response => {
      if (response.status === "authenticated") {
        this.snackBar.open("Logged in!", "OK", {duration: 2000});
        return this.router.navigate(['/home']);
      }
      else
        this.loginError = response.error;
    }, err => {
      if (err.status == 404) {
        this.loginError = "Service is unavailable.";
      } else {
        console.log(err);
      }
    })
  }
}
