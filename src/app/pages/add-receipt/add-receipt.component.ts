import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
declare var jQuery: any;
import { Router } from '@angular/router';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceModel, ReceiptModel } from '../../models/receipt.model';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.css']
})
export class AddReceiptComponent implements OnInit, OnDestroy {
  // frmReceipt!: FormGroup;
  frmReceipt!: any;
  id = '';
  receipt: ReceiptModel = new ReceiptModel();
  subscription = new Subject();
  grandTotal = 0;
  receiptDate!: string;
  mobileNumber!: number;
  custName!: string;
  rcDate!: string;
  taxableAmountSum: number = 0;
  sgstSum: number = 0;
  cgstSum: number = 0;
  p = 1;
  invoiceArray: any = [];
  invoice: InvoiceModel = new InvoiceModel()
  submitted = false;
  textSearch: string = '';
  products!: any[];

  selectedFile: any = null;
  RECEIPT_INVOICE_COLUMNS: string[] = [];
  warningText: string = '';
  appStrings: any;
  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.frmReceipt = this.formBuilder.group({
      id: [""],
      customerName: ["", Validators.required],
      receiptDate: [(new Date()).toISOString().substring(0, 10), Validators.required],
      mobileNumber: [, Validators.maxLength(10)],
      gst: [],
      cgst: [],
      sgst: [],
      igst: [],
      tax: [],
      productName: [null, Validators.required],
      quantity: [, Validators.required],
      rate: [, Validators.required]
    });

    this.appStrings = this.appStringsService.appStrings;
    this.RECEIPT_INVOICE_COLUMNS = this.appConstants.RECEIPT_INVOICE_COLUMNS;
    this.getProducts();
  }

  //GST SUM calculation Start
  claculateGST() {
    this.frmReceipt.get('tax').value = (this.frmReceipt?.get('gst')?.value / 2);
    if (!isNaN(this.frmReceipt?.get('tax')?.value)) {
      this.frmReceipt?.get('cgst')?.setValue(this.frmReceipt?.get('tax')?.value);
      this.frmReceipt?.get('sgst')?.setValue(this.frmReceipt?.get('tax')?.value);
    }
  }

  //GST calculation Start
  calc() {
    console.log(this.frmReceipt?.value);

    this.invoice.quantity = this.frmReceipt.get('quantity').value;
    this.invoice.receiptDate = this.frmReceipt.get('receiptDate').value;
    this.invoice.rate = this.frmReceipt.get('rate').value;
    this.invoice.customerName = this.frmReceipt.get('customerName').value;
    this.invoice.productName = this.frmReceipt.get('productName').value;
    this.invoice.taxableAmount = this.invoice.rate * this.invoice.quantity;
    this.taxableAmountSum += this.invoice.taxableAmount;
    this.invoice.gst = this.frmReceipt.get('gst').value;
    if (this.invoice.gst == undefined || this.invoice.gst == null) {
      this.invoice.cgst = 0;
      this.invoice.sgst = 0;
      this.invoice.gst = 0;
    }
    let total = this.invoice.taxableAmount;
    let totalTaxAmount = (total * this.invoice.gst) / 100;
    this.invoice.cgst = totalTaxAmount / 2;
    this.invoice.sgst = totalTaxAmount / 2;
    this.cgstSum += this.invoice.cgst;
    this.sgstSum += this.invoice.cgst;
    if (isNaN(this.cgstSum)) {
      this.cgstSum = 0;
      this.sgstSum = 0;
    }
    this.invoice.total = this.invoice.taxableAmount + this.invoice.cgst + this.invoice.sgst;
    this.invoice.total = parseInt(this.invoice.total.toFixed(2));
    this.grandTotal += this.invoice.total;
    this.invoiceArray.push(this.invoice);
    this.invoice = {
      customerName: '',
      productName: '',
      quantity: 0,
      receiptDate: '',
      rate: 0,
      taxableAmount: 0,
      gst: this.invoice.gst,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    }
    this.submitted = false;
    this.frmReceipt.get('quantity').setValue('');
    this.frmReceipt.get('rate').setValue('');
    this.frmReceipt.get('productName').setValue(null);
  }

  /**
   * routing back to receipt listing 
   */
  backToReceipt() {
    this.router.navigate(['default/receipt']);
  }

  /**
   * 
   */
  setProductPrice() {
    console.log(this.products)
    const product = this.products?.find(item => item.name == this.frmReceipt.get('productName').value);
    if (product) {
      this.frmReceipt.get('rate').setValue(product?.price);
    } else {
      this.frmReceipt.get('rate').setValue('');
    }
    console.log(this.frmReceipt.get('productName').value)
  }

  //POST package
  onSubmit() {
    this.receipt.name = this.custName;
    this.receipt.receiptDate = this.rcDate;
    this.receipt.taxableAmount = this.taxableAmountSum;
    this.receipt.cgst = this.cgstSum;
    this.receipt.sgst = this.sgstSum;
    this.receipt.grandTotal = this.grandTotal;
    this.receipt.products = this.invoiceArray;
    this.receipt.mobileNumber = this.mobileNumber;
    this.receipt.gst = this.frmReceipt?.get('gst')?.value;
    this.receipt.id = this.id;
    this.submitted = true;
    if (this.frmReceipt.invalid) {
      // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
      return;
    }
    // this.receipt.receiptDate = moment(this.frmReceipt.value.date).format('DD-MM-YYYY') ;
    console.log('this.receipt');
    console.log(this.receipt);
    return
    this.commonService.saveReceipt(this.receipt).subscribe((response: any) => {
      if (response.status) {
        // this.toaster.successToastr('Receipt saved successfully. ', 'Success!',{showCloseButton: true});
        this.receipt = {
          id: '',
          name: '',
          mobileNumber: 0,
          receiptDate: '',
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          grandTotal: 0,
          products: [],
          gst: 0
        };
        this.taxableAmountSum = 0;
        this.cgstSum = 0;
        this.sgstSum = 0;
        this.grandTotal = 0
        this.id = '';
        this.invoiceArray = [];
        this.frmReceipt.reset();
        this.submitted = false;
      } else {

      }
    }, (error: HttpErrorResponse) => {
      return;
    });
  }


  /**
  * get products data
  */
  getProducts(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.getProducts().pipe(takeUntil(this.subscription)).subscribe((response: any) => {
      this.products = response;
      this.commonService.$loaderSubject?.next({ showLoader: false });
    }, (error: HttpErrorResponse) => {
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  //Edit invoiceRow
  editinvoiceRow(index: any, data: any) {
    this.grandTotal -= data.total;
    this.invoiceArray.splice(index, 1);
    if (!this.invoiceArray.length) {
      this.grandTotal = 0;
    }
    this.frmReceipt.get('customerName').setValue(data.customerName);
    this.frmReceipt.get('productName').setValue(data.productName);
    this.frmReceipt.get('receiptDate').setValue(data.receiptDate);
    this.frmReceipt.get('rate').setValue(data.rate);
    this.frmReceipt.get('quantity').setValue(data.quantity);
    this.frmReceipt.get('gst').setValue(data.gst);
    this.frmReceipt.get('cgst').setValue(data.cgst);
    this.frmReceipt.get('sgst').setValue(data.sgst);
    this.frmReceipt.get('igst').setValue(data.igst);
    this.frmReceipt.get('igst').setValue(data.igst);

  }

  /**
   * 
   * @param index 
   * @param data 
   */
  removeRow(index: any, data: any) {
    this.invoiceArray.splice(index, 1);
    this.grandTotal = this.grandTotal - data.total;
    this.taxableAmountSum = this.taxableAmountSum - data.taxableAmount;
    this.cgstSum = this.cgstSum - data.cgst;
    this.sgstSum = this.sgstSum - data.sgst;
  }

  /**
   * 
   */
  get f() { return this.frmReceipt.controls; }

  /**
   * 
   */
  clearForm() {
    this.frmReceipt.reset();
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false)
  }
}
