import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material";
import {Subscription} from "rxjs/internal/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../services/account.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  tab: String;
  selectedIndex: int;

  signUpForm: FormGroup;
  signUpErrors = {username: [], password1: [], password2: [], email: []};

  forms = {
    "register": 0,
    "login": 1,
    "forgot-password": 2
  };
  private sub: Subscription;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountService) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', [Validators.email]],
    });

    this.sub = this.route.params.subscribe(params => {
      this.selectedIndex = this.forms[params['tab']];
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private update_route(tabChangeEvent: MatTabChangeEvent) {
    this.tab = tabChangeEvent.tab.textLabel.toLowerCase().replace(" ", "-");
    this.router.navigate(['/account', this.tab]);
  }


  private register_account() {
    this.accountService.create_account(this.signUpForm).subscribe(res => {
      return res;
    }, err => {
      this.signUpErrors.username = [];
      this.signUpErrors.email = [];
      this.signUpErrors.password1 = [];
      this.signUpErrors.password2 = [];
      for (const [key, value] of Object.entries(err.error.errors)) this.signUpErrors[key].push(value)
    });
  }
}
