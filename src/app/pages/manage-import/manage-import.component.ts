import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImportModel } from "../../models/import.model";
import { CommonServiceService } from "../../core/services/common-service.service";
import { Subject, takeUntil } from "rxjs";
import { AppConstants } from "../../shared/app-contants.service";
import { AppStrings } from "../../shared/app-strings.service";
import { AppUtilityService } from "../../core/services/app-utility.service";

declare var jQuery: any;
@Component({
  selector: 'app-manage-import',
  templateUrl: './manage-import.component.html',
  styleUrls: ['./manage-import.component.css']
})
export class ManageImportComponent implements OnInit, OnDestroy {
  frmImport!: FormGroup;
  p: number = 1;
  submitted = false;
  imports: ImportModel[] = [];
  import!: ImportModel;
  textSearch: string = '';
  selectedRecord!: ImportModel;
  isUpdate!: boolean;
  subscription = new Subject();
  warningText: string = '';
  appStrings: any;
  IMPORT_GRID_COLUMNS: string[] = [];

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.frmImport = this.formBuilder.group({
      id: [null],
      date: ['', Validators.required],
      amount: [, Validators.required],
      description: [""]
    });
    this.appStrings = this.appStringsService.appStrings;
    this.IMPORT_GRID_COLUMNS = this.appConstants.IMPORT_GRID_COLUMNS;
    this.getImports();
  }

  /**
   * saving import data
   * @returns 
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.frmImport.invalid) {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: 'Please enter mendatory fields.'
      });
      return;
    }
    this.import = this.frmImport.value;
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.saveImport(this.import, this.isUpdate)?.pipe(takeUntil(this.subscription)).subscribe(() => {
      this.getImports();
      this.commonService.$loaderSubject?.next({ showLoader: false });
      jQuery('#addImport').modal('hide');
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
   * capturing form controls
   * @returns
   */
  get f() { return this.frmImport.controls; }

  /**
   * get Imports data
   */
  getImports(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService.getImports().pipe(takeUntil(this.subscription)).subscribe((response: ImportModel[]) => {
      this.imports = response;
      if (this.imports.length == 0) {
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
   * edit import
   * @param data 
   */
  editImport(data: ImportModel): void {
    this.isUpdate = true;
    this.frmImport.reset();
    this.frmImport.patchValue(data);
  }

  /**
   * confirm delete popup
   * @param data 
   */
  confirmDelete(data: ImportModel): void {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  /**
   * delete import record
   */
  deleteImport(): void {
    this.commonService.deleteImport(this.selectedRecord?.id)?.pipe(takeUntil(this.subscription)).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.getImports();
    }, (error: HttpErrorResponse) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * clearing form value
   */
  clearForm(): void {
    this.isUpdate = false;
    this.frmImport.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
