import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { SaleModel } from '../../models/sale.model';
import { CommonServiceService } from '../../core/services/common-service.service';
declare var jQuery: any;

@Component({
  selector: 'app-manage-sales',
  templateUrl: './manage-sales.component.html',
  styleUrls: ['./manage-sales.component.css']
})
export class ManageSalesComponent implements OnInit {
  frmSale!: FormGroup;
  sale!: SaleModel;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  sales!:any [];
  selectedFile = null;
  // @ViewChild('addProject', {static: false}) public addProject: ModalDirective;

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmSale =  this.formBuilder.group({
      $key: [null],
      date: ['', Validators.required],
      actualAmount: [0, Validators.required],
      saleAmount: [0, Validators.required],
      profitAmount: [0, Validators.required]
    });
    this.getSales();
    this.calculateCredit();
  }


  //Calculate Credit amount
  calculateCredit(){
    let actualAmount = 0;
    let saleAmount = 0;
    let profitAmount = 0;

    if(this.frmSale?.get('actualAmount')?.value == undefined){
      this.frmSale?.get('profitAmount')?.setValue(0);
      return;
    }
    if(this.frmSale?.get('saleAmount')?.value == undefined){
      this.frmSale?.get('profitAmount')?.setValue(0);
      return;
    }
    this.frmSale?.get('actualAmount')?.valueChanges.subscribe((item)=>{
      actualAmount = item;
      profitAmount = saleAmount - actualAmount;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    })
    this.frmSale?.get('saleAmount')?.valueChanges.subscribe((item)=>{
      saleAmount = item;
      if(this.frmSale?.get('saleAmount')?.value == 'null'){
        this.frmSale?.get('profitAmount')?.setValue(0);
      }

      profitAmount = saleAmount - actualAmount;
      this.frmSale?.get('profitAmount')?.setValue(profitAmount);
    })

  }

  //POST package
  onSubmit(){
    this.submitted = true;
    if (this.frmSale.invalid) {
      // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
      return;
    }
    this.sale = this.frmSale.value;
    if(this.frmSale?.get('$key')?.value == null){
      // this.sale.date = moment(this.frmSale.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveSale(this.sale).then((response: any) => {
        if (response) {
          // this.toaster.successToastr('Data saved successfully. ', 'Success!',{showCloseButton: true});
          this.getSales();
          jQuery('#addSale').modal('hide');
        } else {
          // this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});

        }
      }, (error: HttpErrorResponse) => {
        // this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});
        return;
      });
    }
    else{
      // this.sale.date = moment(this.frmSale.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.updateSale(this.sale);
        if (this.subscription) {
          // this.toaster.successToastr('Sales updated successfully. ', 'Success!',{showCloseButton: true});
          this.getSales();
          jQuery('#addSale').modal('hide');
          //  this.getpackage();
        } else {
          // this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});
        }
    }
  }
  get f() { return this.frmSale.controls; }


  //Edit package
  editImport(data: SaleModel){
    this.frmSale.controls?.['date']?.setValue(this.dateConverter(data.date));
    this.frmSale.controls?.['actualAmount']?.setValue(data.actualAmount);
    this.frmSale.controls?.['saleAmount']?.setValue(data.saleAmount);
    this.frmSale.controls?.['profitAmount']?.setValue(data.profitAmount);
    this.frmSale.controls?.['_id']?.setValue(data._id);
  }

  //GET sales
  getSales(){
    this.commonService.getSales().subscribe((response : any)=>{
      if (response) {
        this.sales = response.map((item:any)=>{
          return {
            $key: item.key,
            ...item.payload.val()
          }
        });
        console.log('this.sales');
        console.log(this.sales);
      }else {
        // this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      return;
    });
  }

  //Delete package
  deleteSale(id:any){
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this record!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Delete',
    //   cancelButtonText: 'Cancel'
    // })
    // .then((result) => {
    //   if (result.value) {

    //     let response =  this.commonService.deleteSale(id)
    //       if (response) {
    //         // this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
    //         this.getSales();
    //       }else {
    //         // this.toaster.errorToastr('Error while deleting sale.', 'Oops!',{showCloseButton: true});
    //       }
    //   }});
    }

    //package Date Conversion
    dateConverter(date:any){
      var dateArray = date.split('-');
      var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
      var newDate = new Date( dateStr);
      return newDate;
    }

    // clear form value
    clearForm() {
      this.frmSale.reset();
      this.submitted = false;
    }
  }
