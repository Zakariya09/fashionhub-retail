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
import { CommonServiceService } from "../core/services/common-service.service";

@NgModule({
    declarations: [
        AlertComponent,
        ConfirmModal,
        AppLoader,
        FilterPipe
    ],
    imports: [
        CommonModule,
        provideFirebaseApp(() => initializeApp({
          apiKey: "AIzaSyDWVdIX4qhpzSroSSa1EygkJOyGEBcK48s",
          authDomain: "fashionhub-retail.firebaseapp.com",
          databaseURL: "https://fashionhub-retail-default-rtdb.firebaseio.com",
          projectId: "fashionhub-retail",
          storageBucket: "fashionhub-retail.appspot.com",
          messagingSenderId: "760169180118",
          appId: "1:760169180118:web:bf633739663b850e379277",
          measurementId: "G-33SGX0FL49"
        })),
        provideFirestore(() => getFirestore()),
    ],
    providers:[
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
          CommonServiceService,
          
    ],
    exports: [
        AlertComponent,
        ConfirmModal,
        AppLoader,
        FilterPipe
    ]
})
export class SharedModule { }