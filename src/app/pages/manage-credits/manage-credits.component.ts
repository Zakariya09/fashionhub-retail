import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { CreditModel } from '../../models/credit.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppConstants } from '../../shared/app-contants.service';
import { Subject, takeUntil } from 'rxjs';
import { AppUtilityService } from '../../core/services/app-utility.service';
declare var jQuery: any;

@Component({
  selector: 'app-manage-credits',
  templateUrl: './manage-credits.component.html',
  styleUrls: ['./manage-credits.component.css']
})
export class ManageCreditsComponent implements OnInit, OnDestroy {
  frmCredit!: FormGroup;
  credit!: CreditModel;
  subscription = new Subject();
  p = 1;
  submitted = false;
  textSearch = '';
  credits!: any;
  appStrings: any;
  CREDIT_GRID_COLUMNS: string[] = [];
  warningText: string = '';
  isUpdate!: boolean;
  selectedRecord!: CreditModel;

  constructor(private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appStringsService: AppStrings,
    private appConstants: AppConstants,
    private utilityService: AppUtilityService

  ) { }

  ngOnInit() {
    this.frmCredit = this.formBuilder.group({
      id: [null],
      date: [, Validators.required],
      name: [, Validators.required],
      productPrice: [0, Validators.required],
      paidAmount: [0, Validators.required],
      remainingAmount: [0, Validators.required]
    });
    this.appStrings = this.appStringsService.appStrings;
    this.CREDIT_GRID_COLUMNS = this.appConstants.CREDIT_GRID_COLUMNS;
    this.getCredit();
    this.calculateCredit();
  }

  /**
   * 
   * @returns 
   */
  calculateCredit() {
    let productPrice = 0;
    let paidAmount = 0;
    let remainingAmount = 0;

    if (this.frmCredit.get('productPrice')?.value == undefined) {
      this.frmCredit.get('remainingAmount')?.setValue(0);
      return;
    }
    if (this.frmCredit.get('paidAmount')?.value == undefined) {
      this.frmCredit.get('remainingAmount')?.setValue(0);
      return;
    }

    this.frmCredit.get('productPrice')?.valueChanges.subscribe((item) => {
      productPrice = item;
      if (productPrice < paidAmount) {
        this.frmCredit.get('remainingAmount')?.setValue(0);
        return
      }
      remainingAmount = productPrice - paidAmount;
      this.frmCredit.get('remainingAmount')?.setValue(remainingAmount);
    })
    this.frmCredit.get('paidAmount')?.valueChanges.subscribe((item) => {
      paidAmount = item;
      if (productPrice < paidAmount) {
        this.frmCredit.get('remainingAmount')?.setValue(0);
        return
      }
      remainingAmount = productPrice - paidAmount;
      this.frmCredit.get('remainingAmount')?.setValue(remainingAmount);
    })

  }

  /**
       * saving sale data
       * @returns 
       */
  onSubmit(): void {
    this.submitted = true;
    if (this.frmCredit.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter mendatory fields.'
      });
      return;
    }
    this.credit = this.frmCredit.value;
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.saveCredit(this.credit, this.isUpdate)?.pipe(takeUntil(this.subscription)).subscribe(() => {
      this.getCredit();
      this.commonService.$loaderSubject?.next({ showLoader: false });
      jQuery('#addCredit').modal('hide');
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
   * @returns
   */
  get f() { return this.frmCredit.controls; }

  /**
 * get Sales data
 */
  getCredit(): void {
    this.warningText = 'Loading Data...';
    this.commonService.getCredits().pipe(takeUntil(this.subscription)).subscribe((response: CreditModel[]) => {
      this.credits = response;
      this.warningText = 'No Data Found!';
    }, (error: HttpErrorResponse) => {
      this.warningText = 'No Data Found!';
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * 
   * @param data 
   */
  editCredit(data: CreditModel) {
    this.isUpdate = true;
    this.frmCredit.reset();
    this.frmCredit.patchValue(data);
  }

  /**
    * confirm delete popup
    * @param data 
    */
  confirmDelete(data: CreditModel) {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  /**
   * Deleting Credit record
   */
  deleteCredit() {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.deleteCredit(this.selectedRecord?.id)?.pipe(takeUntil(this.subscription)).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.getCredit();
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
   * resetting credit form
   */
  clearForm() {
    this.isUpdate = false;
    this.frmCredit.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false)
  }
}
