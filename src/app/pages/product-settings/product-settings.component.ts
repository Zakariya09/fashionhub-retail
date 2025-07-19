import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppConstants } from '../../shared/app-contants.service';
import { Subject, takeUntil } from 'rxjs';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { ProductType } from '../../models/settings.model';
declare var jQuery: any;

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrl: './product-settings.component.css',
})
export class ProductSettingsComponent {
  frmProductType!: FormGroup;
  productType!: ProductType;
  subscription = new Subject();
  p = 1;
  submitted = false;
  textSearch = '';
  productTypes!: ProductType[];
  appStrings: any;
  PRODUCT_TYPE_COLUMNS: string[] = [];
  warningText: string = '';
  isUpdate!: boolean;
  selectedRecord!: ProductType;

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appStringsService: AppStrings,
    private appConstants: AppConstants,
    private utilityService: AppUtilityService
  ) {}

  ngOnInit() {
    this.frmProductType = this.formBuilder.group({
      id: [null],
      label: [, Validators.required],
    });
    this.appStrings = this.appStringsService.appStrings;
    this.PRODUCT_TYPE_COLUMNS = this.appConstants.PRODUCT_TYPE_COLUMNS;
    this.getProductTypes();
  }

  /**
   * saving product type data
   * @returns
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.frmProductType.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter mendatory fields.',
      });
      return;
    }
    this.productType = this.frmProductType.value;
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService
      .saveProductType(this.productType, this.isUpdate)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        () => {
          this.getProductTypes();
          this.commonService.$loaderSubject?.next({ showLoader: false });
          jQuery('#addSetting').modal('hide');
          this.isUpdate = false;
        },
        (error: HttpErrorResponse) => {
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
  }

  /**
   * @returns
   */
  get f() {
    return this.frmProductType.controls;
  }

  /**
   * get product types data
   */
  getProductTypes(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getProductTypes()
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: ProductType[]) => {
          this.productTypes = response;
          if (this.productTypes?.length == 0) {
            this.warningText = this.appStrings['noDataFound'];
          }
        },
        (error: HttpErrorResponse) => {
          this.warningText = this.appStrings['noDataFound'];
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
  }

  /**
   *
   * @param data
   */
  editProductType(data: ProductType): void {
    this.isUpdate = true;
    this.frmProductType.reset();
    this.frmProductType.patchValue(data);
  }

  /**
   * confirm delete popup
   * @param data
   */
  confirmDelete(data: ProductType): void {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({
      showModal: true,
      type: 'delete',
    });
  }

  /**
   * Deleting product type record
   */
  deleteProductType(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService
      .deleteProductType(this.selectedRecord?.id)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        (response) => {
          this.commonService.$confirmSubject.next({ showModal: false });
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.getProductTypes();
        },
        (error: HttpErrorResponse) => {
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
  }

  /**
   * resetting credit form
   */
  clearForm(): void {
    this.isUpdate = false;
    this.frmProductType.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
