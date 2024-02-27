import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
declare var jQuery: any;
import { Router } from '@angular/router';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Subject, takeUntil } from 'rxjs';
import { ReceiptModel, ReceiptProduct } from '../../models/receipt.model';

@Component({
  selector: 'app-manage-receipt',
  templateUrl: './manage-receipt.component.html',
  styleUrls: ['./manage-receipt.component.css']
})
export class ManageReceiptComponent implements OnInit, OnDestroy {
  p = 1;
  receiptData: ReceiptProduct = new ReceiptProduct();
  submitted = false;
  receipts!: any;
  selectedFile = null;
  textSearch: string = '';
  selectedRecord!: any;
  isUpdate!: boolean;
  subscription = new Subject();
  warningText: string = '';
  appStrings: any;
  RECEIPT_GRID_COLUMNS: string[] = [];
  RECEIPT_PRINT_GRID_COLUMNS: string[] = [];

  constructor(
    private commonService: CommonServiceService,
    private router: Router,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.appStrings = this.appStringsService.appStrings;
    this.RECEIPT_GRID_COLUMNS = this.appConstants.RECEIPT_GRID_COLUMNS;
    this.RECEIPT_PRINT_GRID_COLUMNS = this.appConstants.RECEIPT_PRINT_GRID_COLUMNS;
    this.getReceipts();
  }

  /**
  * Get receipts
  */
  getReceipts(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService.getReceipts().pipe(takeUntil(this.subscription)).subscribe((response: ReceiptModel[]) => {
      this.receipts = response;
      if (this.receipts.length == 0) {
        this.warningText = this.appStrings['noDataFound'];
      }
    }, (error: HttpErrorResponse) => {
      this.warningText = this.appStrings['noDataFound'];
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
  * Confirm delete popup
  * @param data 
  */
  confirmDelete(data: ReceiptModel) {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' });
  }

  /**
   * Delete receipt record
   */
  deleteReceipt() {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.deleteReceipt(this.selectedRecord?.id)?.pipe(takeUntil(this.subscription)).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.getReceipts();
    }, (error: HttpErrorResponse) => {
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * Routing to add receipt page
   */
  addReceipt() {
    this.router.navigate(['default/addReceipt']);
  }

  /**
   * Edit receipt
   * @param data 
   */
  editReceipt(data: any) {
    this.router.navigate([`/default/editReceipt`, data.id]);
  }

  /**
   * View receipt
   * @param data 
   */
  viewRecipt(data: any) {
    this.receiptData = data;
    this.receiptData.totalInWords = this.utilityService.number2text(data.grandTotal);
    jQuery('#viewReceipt').modal('show');
  }

  /**
   * Printing receipt formatted div element
   * @param div 
   */
  printReceipt(div: any) {
    this.utilityService.printReceipt(div);
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
