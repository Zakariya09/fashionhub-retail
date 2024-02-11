import { NgModule } from "@angular/core";
import { AlertComponent } from "../common/alert/alert.component";
import { CommonModule } from "@angular/common";
import { ConfirmModal } from "../common/confirm-modal/confirm-modal.component";
import { AppLoader } from "../common/loader/loader.component";
import { FilterPipe } from "./filter.pipe";

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
    exports: [
        AlertComponent,
        ConfirmModal,
        AppLoader,
        FilterPipe
    ]
})
export class SharedModule { }