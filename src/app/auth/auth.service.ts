import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponseData, User } from '../models/auth.model';



@Injectable({ providedIn: 'root' })

export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private baseUrl = 'http://localhost:3000/';
  isLoggedIn: boolean = false;
  userSub = new BehaviorSubject<any>(null);
  clearTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  // authentication
  public validate(user: any, islogin: boolean) {
    let k = islogin;

    let loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDWVdIX4qhpzSroSSa1EygkJOyGEBcK48s';
    let signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDWVdIX4qhpzSroSSa1EygkJOyGEBcK48s';
    return this.http.post<AuthResponseData>(islogin ? loginUrl : signUpUrl, { ...user, returnSecureToken: true }).pipe(catchError(this.getErrorHandler), tap(this.handleUser.bind(this)));
  }

  private handleUser(response: AuthResponseData) {
    const expireDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expireDate
    );
    this.userSub.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+response.expiresIn * 1000);
  }

  getErrorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = 'Something went wrong, please try again.';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address is already taken. Please try another.';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'Invalid credentials! Please enter correct email address.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid Password';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid credentials! Please enter correct details.';
        break;
        case 'WEAK_PASSWORD : Password should be at least 6 characters':
          errorMessage = 'Weak Password! Password should be at least 6 characters.';
          break;
    }
    return throwError(errorMessage);
  }

  autoLogin() {
    let userData: {
      email: string;
      _token: string;
      expirationDate: string;
      localId: string;
    } = JSON.parse(localStorage.getItem('userData') || '');
    if (!userData) {
      return;
    }

    let user = new User(
      userData.email,
      userData.localId,
      userData._token,
      new Date(userData.expirationDate)
    );

    if (user.token) {
      this.userSub.next(user);
    }

    let date = new Date().getTime();
    let expirationDate = new Date(userData.expirationDate).getTime();

    this.autoLogout(expirationDate - date);
  }

  autoLogout(expirationDate: number) {
    this.clearTimeout = setTimeout(() => {
      this.logout();
    }, expirationDate);
  }

  logout() {
    this.userSub.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.isLoggedIn);
      }, 1000);
    });
  }
}

