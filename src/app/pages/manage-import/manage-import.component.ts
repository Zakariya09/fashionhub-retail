import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImportModel } from "../../models/import.model";
import { CommonServiceService } from "../../core/services/common-service.service";
import { Subject, Subscription, takeUntil } from "rxjs";
import { appStrings } from "../../shared/app-strings";
import { AppConstants } from "../../shared/app-contants.service";

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
    private appConstants: AppConstants
  ) { }

  ngOnInit() {
    this.appStrings = appStrings;
    this.frmImport = this.formBuilder.group({
      id: [null],
      date: ['', Validators.required],
      amount: [, Validators.required],
      description: [""]
    });
    this.IMPORT_GRID_COLUMNS = this.appConstants.IMPORT_GRID_COLUMNS;
    this.getImports();
  }

  /**
   * saving import data
   * @returns 
   */
  onSubmit(): void {
    console.log(this.frmImport.value);
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
      console.log('error text')
      console.log(error)
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  /**
   * tracking import loop
   * @param index 
   * @param item 
   * @returns 
   */
  trackImport(index: number, item: ImportModel) {
    return item.id
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
    this.warningText = 'Loading Data...';
    this.commonService.getImports().pipe(takeUntil(this.subscription)).subscribe((response: ImportModel[]) => {
      this.imports = response;
      console.log('this.imports');
      console.log(this.imports);
      this.warningText = 'No Data Found!';
    }, (error: HttpErrorResponse) => {
      console.log('error text')
      console.log(error)
      this.warningText = 'No Data Found!';
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  /**
   * edit import
   * @param data 
   */
  editImport(data: ImportModel) {
    this.isUpdate = true;
    this.frmImport.reset();
    this.frmImport.patchValue(data);
  }

  /**
   * confirm delete popup
   * @param data 
   */
  confirmDelete(data: ImportModel) {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  /**
   * delete import record
   */
  deleteImport() {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.deleteImport(this.selectedRecord?.id)?.pipe(takeUntil(this.subscription)).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.getImports();
    }, (error: HttpErrorResponse) => {
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  /**
   * clearing form value
   */
  clearForm() {
    this.isUpdate = false;
    this.frmImport.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false)
  }
}
