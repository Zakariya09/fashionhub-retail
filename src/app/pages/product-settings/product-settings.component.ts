import { Component } from '@angular/core';
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
  fittingTypes!: Settings[];
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
    this.getSettingsData('productType');
    this.getSettingsData('fittingType');
    this.getSettingsData('topSizes');
    this.getSettingsData('bottomSizes');
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
          this.getSettingsData(this.activeForm);
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
   * get product settings data
   */
  getSettingsData(gridName: string): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getSettings(gridName)
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: Settings[]) => {
          switch (gridName) {
            case 'fittingType':
              this.fittingTypes = response;
              break;
            case 'topSizes':
              this.topSizes = response;
              break;
            case 'bottomSizes':
              this.bottomSizes = response;
              break;
            case 'productType':
              this.productTypes = response;
              break;
          }

          if (response?.length == 0) {
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
   * edit settings record
   */
  edit(obj: any): void {
    const data = obj.data;
    const selectedForm = obj.formType;
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
  confirmDelete(obj: any): void {
    const data = obj.data;
    const selectedForm = obj.formType;
    this.activeForm = selectedForm;
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({
      showModal: true,
      type: 'delete',
    });
  }

  /**
   * delete settings record
   */
  deleteSettings(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService
      .deleteSettings(this.selectedRecord?.id, this.activeForm)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        (response) => {
          this.commonService.$confirmSubject.next({ showModal: false });
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.getSettingsData(this.activeForm);
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
   * resetting settings form
   */
  clearForm(): void {
    this.isUpdate = false;
    this.frmSettings.reset();
    this.submitted = false;
  }

  /**
   *
   * @param selectedForm
   * initializing form settings add modal
   */
  addForm(selectedForm: any) {
    this.formTitle = this.setFormTitle(this.appStrings['add'], selectedForm);
    this.activeForm = selectedForm;
  }

  /**
   * setting modal title
   * @param operation
   * @param selectedForm
   * @returns
   */
  setFormTitle(operation: string, selectedForm: string) {
    return operation + ' ' + this.appStrings[selectedForm];
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
