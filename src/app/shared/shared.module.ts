import { NgModule } from "@angular/core";
import { AlertComponent } from "../common/alert/alert.component";
import { CommonModule } from "@angular/common";
import { ConfirmModal } from "../common/confirm-modal/confirm-modal.component";

@NgModule({
    declarations: [
        AlertComponent,
        ConfirmModal
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        ConfirmModal
    ]
})
export class SharedModule { }