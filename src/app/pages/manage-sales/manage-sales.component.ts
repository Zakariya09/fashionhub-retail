import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { SaleModel } from '../../models/sale.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { Subject, takeUntil } from 'rxjs';
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
  sales!: any[];
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
    private appStringsService: AppStrings
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
    this.calculateCredit();
  }


  //Calculate Credit amount
  calculateCredit() {
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
    this.frmSale?.get('actualPrice')?.valueChanges.subscribe((item) => {
      actualPrice = item;
      profitAmount = sellingPrice - actualPrice;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    })
    this.frmSale?.get('sellingPrice')?.valueChanges.subscribe((item) => {
      sellingPrice = item;
      if (this.frmSale?.get('sellingPrice')?.value == 'null') {
        this.frmSale?.get('profitAmount')?.setValue(0);
      }

      profitAmount = sellingPrice - actualPrice;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    })

  }
  /**
     * saving import data
     * @returns 
     */
  onSubmit(): void {
    console.log(this.frmSale.value);
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


  get f() { return this.frmSale.controls; }


  //Edit package
  editImport(data: SaleModel) {
    this.frmSale.controls?.['date']?.setValue(this.dateConverter(data.date));
    this.frmSale.controls?.['actualPrice']?.setValue(data.actualPrice);
    this.frmSale.controls?.['sellingPrice']?.setValue(data.sellingPrice);
    this.frmSale.controls?.['profitAmount']?.setValue(data.profitAmount);
    this.frmSale.controls?.['id']?.setValue(data.id);
  }

  //GET sales
  getSales() {
    this.commonService.getSales().subscribe((response: any) => {
      if (response) {
        this.sales = response.map((item: any) => {
          return {
            id: item.key,
            ...item.payload.val()
          }
        });
        console.log('this.sales');
        console.log(this.sales);
      } else {
        // this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      return;
    });
  }

  /**
  * confirm delete popup
  * @param data 
  */
  confirmDelete(data: SaleModel) {
    this.selectedRecord = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' })
  }

  //Delete package
  deleteSale() {
  }

  //package Date Conversion
  dateConverter(date: any) {
    var dateArray = date.split('-');
    var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    var newDate = new Date(dateStr);
    return newDate;
  }

  // clear form value
  clearForm() {
    this.frmSale.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false)
  }
}
