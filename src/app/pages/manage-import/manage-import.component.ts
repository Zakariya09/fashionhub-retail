import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImportModel } from "../../models/import.model";
import { CommonServiceService } from "../../core/services/common-service.service";
import { Subscription } from "rxjs";

declare var jQuery: any;

@Component({
  selector: 'app-manage-import',
  templateUrl: './manage-import.component.html',
  styleUrls: ['./manage-import.component.css']
})
export class ManageImportComponent implements OnInit, OnDestroy {
  frmImport!: FormGroup;
  subscription!: Subscription;
  p = 1;
  submitted = false;
  imports!: any;
  import!: ImportModel;
  textSearch: string = '';
  selectedRecord!: any;
  isUpdate!: boolean;
  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmImport = this.formBuilder.group({
      id: [null],
      date: ['', Validators.required],
      amount: [, Validators.required],
      description: [""]
    });
    this.getImports();
  }

  //POST package
  onSubmit() {
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
    this.subscription = this.commonService.saveImport(this.import, this.isUpdate).subscribe((response: any) => {
      this.getImports();
      jQuery('#addImport').modal('hide');
      this.isUpdate = false;
    }, (error: HttpErrorResponse) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  get f() { return this.frmImport.controls; }

  //GET package
  getImports() {
    this.commonService.getImports().subscribe((response: any) => {
      this.imports = response;
      console.log('this.imports');
      console.log(this.imports);
    }, (error: HttpErrorResponse) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  //Edit package
  editImport(data: ImportModel) {
    this.isUpdate = true;
    this.frmImport.patchValue(data);
  }

  confirmDelete(data: any) {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  //Delete package
  deleteImport() {
    this.commonService.deleteImport(this.selectedRecord?.id).subscribe((response) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.getImports();
    }, (error: HttpErrorResponse) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: error
      });
    });
  }

  // clear form value
  clearForm() {
    this.isUpdate = false;
    this.frmImport.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
