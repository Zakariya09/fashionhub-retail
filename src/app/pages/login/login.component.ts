import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginModel } from '../../models/login.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  submitted!: boolean;
  frmLogin!: FormGroup;
  userData = {};
  login!: LoginModel;
  isLogin: boolean = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  timeout: any;
  constructor(private router: Router, private formBuilder: FormBuilder, private commonService: CommonServiceService, private auth: AuthService) { }
  ngOnInit() {
    this.frmLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUp() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    this.submitted = true;
    this.login = this.frmLogin.value;
    this.frmLogin.touched;
    if (this.frmLogin.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter username & password fields.'
      });
      return;
    }
    console.log(this.frmLogin?.value)
    this.auth.validate(this.login, this.isLogin)?.pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      console.log('response')
      console.log(response)
      if (response?.registered) {
        this.commonService.$alertSubject?.next({
          type: 'success',
          showAlert: true,
          message: 'Welcome User'
        });
        this.timeout = setTimeout(() => {
          this.router.navigate(['/default/dashboard']);
        }, 3000);
      } else {
        this.commonService.$alertSubject?.next({
          type: 'success',
          showAlert: true,
          // message: 'Registered successfully, Please login with your credentials!'
          message: 'Registered successfully!'
        });
        // this.isLogin = true;
        this.timeout = setTimeout(() => {
          this.router.navigate(['/default/dashboard']);
        }, 3000);
      }
    }, (error: HttpErrorResponse) => {
      console.log(error)
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
      return;
    });
  }

  get f() { return this.frmLogin.controls; }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    clearTimeout(this.timeout);
  }
}
