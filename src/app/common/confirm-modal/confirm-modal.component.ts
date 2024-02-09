import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonServiceService } from "../../core/services/common-service.service";
declare var jQuery: any;

export interface ConfirmModalModel {
    showModal: boolean;
    type?: string;
}
@Component({
    selector: 'app-confirm-modal',
    templateUrl: 'confirm-modal.component.html',
    styleUrls: ['confirm-modal.component.css']
})
export class ConfirmModal implements OnInit {
    modalType: string | undefined = 'delete';
    @Output() onConfirmCallback = new EventEmitter();
    @Input() module!: string;

    constructor(private commonService: CommonServiceService) { }
    ngOnInit(): void {
        this.commonService.$confirmSubject.subscribe((data: ConfirmModalModel) => {
            this.modalType = data.type;
            if (data.showModal) {
                this.showModal()
            } else {
                this.hideModal();
            }
        });
    }

    showModal() {
        jQuery('#ss').modal('show');
    }

    hideModal() {
        jQuery('#ss').modal('hide');
    }
}