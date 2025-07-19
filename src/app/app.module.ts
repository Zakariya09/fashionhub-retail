import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './auth/guards/auth-guard.service';
import { SharedModule } from './shared/shared.module';
import { ProductSettingsComponent } from './pages/product-settings/product-settings.component';

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    ProductSettingsComponent,
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
