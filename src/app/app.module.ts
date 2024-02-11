import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
// import {NgxPrintModule} from 'ngx-print';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from './core/intercepter/auth-interceptor.service';
import { LoggingInterceptorService } from './core/intercepter/logging-interceptor.service';
import { AuthTokenInterceptorService } from './core/intercepter/auth-token-interceptor.service';
import { AuthGuardService } from './auth/guards/auth-guard.service';
import { AlertComponent } from './common/alert/alert.component';
import { SharedModule } from './shared/shared.module';
// import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    AuthGuardService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
