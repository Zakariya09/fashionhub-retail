import { NgModule } from "@angular/core";
import { AlertComponent } from "../common/alert/alert.component";
import { CommonModule } from "@angular/common";
import { ConfirmModal } from "../common/confirm-modal/confirm-modal.component";
import { AppLoader } from "../common/loader/loader.component";
import { FilterPipe } from "./filter.pipe";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorService } from "../core/intercepter/auth-interceptor.service";
import { LoggingInterceptorService } from "../core/intercepter/logging-interceptor.service";
import { AuthTokenInterceptorService } from "../core/intercepter/auth-token-interceptor.service";
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from "../core/services/environment";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [
    AlertComponent,
    ConfirmModal,
    AppLoader,
    FilterPipe
  ],
  imports: [
    CommonModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptorService,
      multi: true,
    },
  ],
  exports: [
    AlertComponent,
    ConfirmModal,
    AppLoader,
    FilterPipe,
    NgxPaginationModule
  ]
})
export class SharedModule { }