import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppConstants } from '../../shared/app-contants.service';
import { Subject, takeUntil } from 'rxjs';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Settings } from '../../models/settings.model';
declare var jQuery: any;

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrl: './product-settings.component.css',
})
export class ProductSettingsComponent {
  frmSettings!: FormGroup;
  setting!: Settings;
  subscription = new Subject();
  p = 1;
  submitted = false;
  textSearch = '';
  productTypes!: Settings[];
  appStrings: any;
  PRODUCT_SETTINGS_COLUMNS: string[] = [];
  warningText: string = '';
  isUpdate!: boolean;
  selectedRecord!: Settings;
  activeForm!: string;
  formTitle!: string;
  fittinngTypes!: Settings[];
  topSizes!: Settings[];
  bottomSizes!: Settings[];

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appStringsService: AppStrings,
    private appConstants: AppConstants,
    private utilityService: AppUtilityService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.appStrings = this.appStringsService.appStrings;
    this.PRODUCT_SETTINGS_COLUMNS = this.appConstants.PRODUCT_SETTINGS_COLUMNS;
    this.getProductTypes();
    this.getFittingTypes();
    this.getTopSizes();
    this.getBottomSizes();
  }

  /**
   * forms initilizer
   */
  initializeForms() {
    this.frmSettings = this.buildForm();
  }

  /**
   * building a form using form builder
   * @returns
   */
  buildForm() {
    return this.formBuilder.group({
      id: [null],
      label: [, Validators.required],
    });
  }

  /**
   * saving product type data
   * @returns
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.frmSettings.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter mendatory fields.',
      });
      return;
    }
    this.setting = this.frmSettings.value;
    if (this.activeForm == 'topSizes' || this.activeForm == 'bottomSizes') {
      this.setting.isChecked = false;
    }

    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService
      .saveSetting(this.setting, this.isUpdate, this.activeForm)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        () => {
          switch (this.activeForm) {
            case 'fittingType':
              this.getFittingTypes();
              break;
            case 'topSizes':
              this.getTopSizes();
              break;
            case 'bottomSizes':
              this.getBottomSizes();
              break;
            case 'productType':
              this.getProductTypes();
              break;
          }
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
    return this.frmSettings.controls;
  }

  /**
   * get product types data
   */
  getProductTypes(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getSettings('productType')
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: Settings[]) => {
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
   * get product types data
   */
  getFittingTypes(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getSettings('fittingType')
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: Settings[]) => {
          this.fittinngTypes = response;
          if (this.fittinngTypes?.length == 0) {
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
   * get product types data
   */
  getTopSizes(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getSettings('topSizes')
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: Settings[]) => {
          this.topSizes = response;
          if (this.topSizes?.length == 0) {
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
   * get product types data
   */
  getBottomSizes(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getSettings('bottomSizes')
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: Settings[]) => {
          this.bottomSizes = response;
          if (this.bottomSizes?.length == 0) {
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
  edit(data: Settings, selectedForm: string): void {
    this.activeForm = selectedForm;
    this.formTitle = this.setFormTitle(this.appStrings['update'], selectedForm);
    this.isUpdate = true;
    this.frmSettings.reset();
    this.frmSettings.patchValue(data);
  }

  /**
   * confirm delete popup
   * @param data
   */
  confirmDelete(data: Settings, selectedForm: string): void {
    this.activeForm = selectedForm;
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
      .deleteProductType(this.selectedRecord?.id, this.activeForm)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        (response) => {
          this.commonService.$confirmSubject.next({ showModal: false });
          this.commonService.$loaderSubject?.next({ showLoader: false });
          switch (this.activeForm) {
            case 'fittingType':
              this.getFittingTypes();
              break;
            case 'topSizes':
              this.getTopSizes();
              break;
            case 'bottomSizes':
              this.getBottomSizes();
              break;
            case 'productType':
              this.getProductTypes();
              break;
          }
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
    this.frmSettings.reset();
    this.submitted = false;
  }

  addForm(selectedForm: any) {
    this.formTitle = this.setFormTitle(this.appStrings['add'], selectedForm);
    this.activeForm = selectedForm;
  }

  setFormTitle(operation: string, selectedForm: string) {
    return operation + ' ' + this.appStrings[selectedForm];
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
