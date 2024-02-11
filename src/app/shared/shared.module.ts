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

@NgModule({
    declarations: [
        AlertComponent,
        ConfirmModal,
        AppLoader,
        FilterPipe
    ],
    imports: [
        CommonModule
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
    ],
    exports: [
        AlertComponent,
        ConfirmModal,
        AppLoader,
        FilterPipe
    ]
})
export class SharedModule { }