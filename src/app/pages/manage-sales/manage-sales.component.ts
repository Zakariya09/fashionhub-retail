import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { SaleModel } from '../../models/sale.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { Subject, takeUntil } from 'rxjs';
import { AppUtilityService } from '../../core/services/app-utility.service';
declare var jQuery: any;

@Component({
  selector: 'app-manage-sales',
  templateUrl: './manage-sales.component.html',
  styleUrls: ['./manage-sales.component.css']
})
export class ManageSalesComponent implements OnInit, OnDestroy {
  frmSale!: FormGroup;
  sale!: SaleModel;
  subscription = new Subject();
  p = 1;
  submitted = false;
  textSearch: string = '';
  sales!: SaleModel[];
  selectedFile = null;
  appStrings: any;
  SALES_GRID_COLUMNS: string[] = [];
  warningText: string = '';
  isUpdate!: boolean;
  selectedRecord!: SaleModel;

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.frmSale = this.formBuilder.group({
      id: [null],
      date: ['', Validators.required],
      actualPrice: [0, Validators.required],
      sellingPrice: [0, Validators.required],
      profitAmount: [0, Validators.required]
    });
    this.appStrings = this.appStringsService.appStrings;
    this.SALES_GRID_COLUMNS = this.appConstants.SALES_GRID_COLUMNS;
    this.getSales();
    this.calculateProfit();
  }

  /**
   * Calculating profit on sales
   * @returns 
   */
  calculateProfit(): void {
    let actualPrice = 0;
    let sellingPrice = 0;
    let profitAmount = 0;
    if (this.frmSale?.get('actualPrice')?.value == undefined) {
      this.frmSale?.get('profitAmount')?.setValue(0);
      return;
    }
    if (this.frmSale?.get('sellingPrice')?.value == undefined) {
      this.frmSale?.get('profitAmount')?.setValue(0);
      return;
    }
    this.frmSale?.get('actualPrice')?.valueChanges?.pipe(takeUntil(this.subscription)).subscribe((item) => {
      actualPrice = item;
      profitAmount = sellingPrice - actualPrice;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    });
    this.frmSale?.get('sellingPrice')?.valueChanges?.pipe(takeUntil(this.subscription))?.subscribe((item) => {
      sellingPrice = item;
      if (this.frmSale?.get('sellingPrice')?.value == 'null') {
        this.frmSale?.get('profitAmount')?.setValue(0);
      }
      profitAmount = sellingPrice - actualPrice;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    });
  }

  /**
     * saving sale data
     * @returns 
     */
  onSubmit(): void {
    this.submitted = true;
    if (this.frmSale.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter mendatory fields.'
      });
      return;
    }
    this.sale = this.frmSale.value;
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.saveSale(this.sale, this.isUpdate)?.pipe(takeUntil(this.subscription)).subscribe(() => {
      this.getSales();
      this.commonService.$loaderSubject?.next({ showLoader: false });
      jQuery('#addSale').modal('hide');
      this.isUpdate = false;
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
   * Providing access to form controls
   * @returns
   */
  get f() { return this.frmSale.controls; }

  /**
     * edit sale
     * @param data 
     */
  editSale(data: SaleModel): void {
    this.isUpdate = true;
    this.frmSale.reset();
    this.frmSale.patchValue(data);
  }

  /**
 * get Sales data
 */
  getSales(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService.getSales().pipe(takeUntil(this.subscription)).subscribe((response: SaleModel[]) => {
      this.sales = response;
      if (this.sales?.length == 0) {
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
  * confirm delete popup
  * @param data 
  */
  confirmDelete(data: SaleModel): void {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  /**
   * Deleting sale record
   */
  deleteSale(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.deleteSale(this.selectedRecord?.id)?.pipe(takeUntil(this.subscription)).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.getSales();
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
   * Resetting form
   */
  clearForm(): void {
    this.isUpdate = false;
    this.frmSale.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false)
  }
}
