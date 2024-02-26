import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';

declare var jQuery: any;
// import Swal from 'sweetalert2';
// import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Subject, takeUntil } from 'rxjs';
import { ReceiptModel } from '../../models/receipt.model';


@Component({
  selector: 'app-manage-receipt',
  templateUrl: './manage-receipt.component.html',
  styleUrls: ['./manage-receipt.component.css']
})
export class ManageReceiptComponent implements OnInit {
  frmreceipt!: FormGroup;
  p = 1;
  receiptData = {
    name: '',
    taxableAmount: 0,
    totalInWords: '',
    mobileNumber: '',
    igst: 0,
    cgst: 0,
    sgst: 0,
    receiptDate: '',
    grandTotal: 0,
    products: []
  };
  submitted = false;
  receipts!: any;
  selectedFile = null;


  textSearch: string = '';
  selectedRecord!: any;
  isUpdate!: boolean;
  subscription = new Subject();
  warningText: string = '';
  appStrings: any;
  RECEIPT_GRID_COLUMNS: string[] = [];
  RECEIPT_PRINT_GRID_COLUMNS: string[] = [];

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) {

  }

  ngOnInit() {
    this.frmreceipt = this.formBuilder.group({
      _id: [0],
      date: [, Validators.required],
      name: [, Validators.required],
      receiptAmount: [0, Validators.required],
      paidAmount: [0, Validators.required],
      remainingAmount: [0, Validators.required]
    });

    this.appStrings = this.appStringsService.appStrings;
    this.RECEIPT_GRID_COLUMNS = this.appConstants.RECEIPT_GRID_COLUMNS;
    this.RECEIPT_PRINT_GRID_COLUMNS = this.appConstants.RECEIPT_PRINT_GRID_COLUMNS;

    this.getReceipts();
  }

  addReceipt() {
    this.router.navigate(['default/addReceipt']);
    localStorage.clear();
  }


  get f() { return this.frmreceipt.controls; }


  /**
  * get receipts data
  */
  getReceipts(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.getReceipts().pipe(takeUntil(this.subscription)).subscribe((response: any) => {
      this.receipts = response;
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
  //Edit package
  editReceipt(data: any) {
    localStorage.setItem('receipt', JSON.stringify(data));
    this.router.navigate(['/default/addReceipt']);
  }

  //Delete package
  deleteReceipt(id: any) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this record!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Delete',
    //   cancelButtonText: 'Cancel'
    // })
    // .then((result:any) => {
    //   if (result.value) {

    // this.commonService.deleteReceipt(id).subscribe((response : any)=>{
    //   if (response.status) {
    //     // this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
    //     this.getReceipt();
    //   }else {
    //     // this.toaster.errorToastr('Error while deleting receipt.', 'Oops!',{showCloseButton: true});
    //     }
    //   }, (error: HttpErrorResponse) => {
    //     // this.toaster.errorToastr('Error while deleting receipt.', 'Oops!',{showCloseButton: true});
    //     return;
    //   });
    // }});
  }

  viewRecipt(data: any) {
    this.receiptData = data;
    this.receiptData.totalInWords = this.number2text(data.grandTotal);

    jQuery('#viewReceipt').modal('show');
  }

  //package Date Conversion
  dateConverter(date: any) {
    var dateArray = date.split('-');
    var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    var newDate = new Date(dateStr);
    return newDate;
  }

  PrintPanel(div: any) {
    var divToPrint = document.getElementById(div);
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th,td {' +
      'border:1px solid #000;' +
      'padding:0.3em;' +
      'text-align:center;' +
      '};' +
      '</style>';
    htmlToPrint += divToPrint?.outerHTML;
    let newWin = window.open(`/default/receipt`);
    newWin?.document.write(htmlToPrint);
    newWin?.print();
    newWin?.close();
  }

  //Convert Number to To Text
  number2text(value: any) {
    var fraction = Math.round(this.frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
      f_text = "And " + this.convert_number(fraction) + " Paise";
    }

    return this.convert_number(value) + " Rupee " + f_text + " Only";
  }

  frac(f: any) {
    return f % 1;
  }

  convert_number(number: any) {
    if ((number < 0) || (number > 999999999)) {
      return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
      res += (this.convert_number(Gn) + " Crore");
    }
    if (kn > 0) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(kn) + " Lakh");
    }
    if (Hn > 0) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(Hn) + " Thousand");
    }

    if (Dn) {
      res += (((res == "") ? "" : " ") +
        this.convert_number(Dn) + " Hundred");
    }


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen");
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

    if (tn > 0 || one > 0) {
      if (!(res == "")) {
        res += " And ";
      }
      if (tn < 2) {
        res += ones[tn * 10 + one];
      }
      else {

        res += tens[tn];
        if (one > 0) {
          res += ("-" + ones[one]);
        }
      }
    }

    if (res == "") {
      res = "zero";
    }
    return res;
  }


  // clear form value
  clearForm() {
    this.frmreceipt.reset();
    this.submitted = false;
  }
}
