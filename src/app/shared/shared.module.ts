import { NgModule } from "@angular/core";
import { AlertComponent } from "../common/alert/alert.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AlertComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent
    ]
})
export class SharedModule { }