import { Input, OnDestroy, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { CommonServiceService } from "../../core/services/common-service.service";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
})

export class AlertComponent implements OnInit, OnDestroy {
    alertType!: string;
    showAlert: boolean = false;
    alertText!: string;
    timeout: any;
    alert = {
        danger: 'danger',
        success: 'success',
        warning: 'warning',
        info: 'info',
    }

    constructor(private commonService: CommonServiceService) {
        commonService.$alertSubject.subscribe((data: any) => {
            this.alertType = data.type;
            this.showAlert = data.showAlert;
            this.alertText = data.message;
            this.timeout = setTimeout(() => {
                this.showAlert = false;
            }, 5000);
        });
    }

    ngOnInit(): void {
    }
    ngOnDestroy(): void {
        clearTimeout(this.timeout);
    }
}