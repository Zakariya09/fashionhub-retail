import { Params } from '@angular/router';
import { exhaustMap, take, tap } from 'rxjs/operators';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthTokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userSub.pipe(
      tap(data =>{
      }),
      // take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        console.log('user******************************')
        console.log(user)
        let modifiedReq = req.clone({
          params: req.params.append('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}