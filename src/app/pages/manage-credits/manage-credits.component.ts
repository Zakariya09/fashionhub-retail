import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { CreditModel } from '../../models/credit.model';
import { CommonServiceService } from '../../core/services/common-service.service';
declare var jQuery: any;

@Component({
  selector: 'app-manage-credits',
  templateUrl: './manage-credits.component.html',
  styleUrls: ['./manage-credits.component.css']
})
export class ManageCreditsComponent implements OnInit {
  frmCredit!: FormGroup;
  credit!: CreditModel;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  credits!:any;
  selectedFile = null;
  // @ViewChild('addProject', {static: false}) public addProject: ModalDirective;
  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmCredit =  this.formBuilder.group({
      $key: [null],
      date: [, Validators.required],
      name: [, Validators.required],
      creditAmount: [0, Validators.required],
      paidAmount: [0, Validators.required],
      remainingAmount: [0, Validators.required]
    });
    this.getCredits();
    this.calculateCredit();
  }

  //Calculate Credit amount
  calculateCredit(){
    let creditAmount = 0;
    let paidAmount = 0;
    let remainingAmount = 0;

    if(this.frmCredit.get('creditAmount')?.value == undefined){
      this.frmCredit.get('remainingAmount')?.setValue(0);
      return;
    }
    if(this.frmCredit.get('paidAmount')?.value == undefined){
      this.frmCredit.get('remainingAmount')?.setValue(0);
      return;
    }

    this.frmCredit.get('creditAmount')?.valueChanges.subscribe((item)=>{
      creditAmount = item;
      if(creditAmount < paidAmount ){
      this.frmCredit.get('remainingAmount')?.setValue(0);
        return
      }
      remainingAmount = creditAmount - paidAmount;
      this.frmCredit.get('remainingAmount')?.setValue(remainingAmount);
    })
    this.frmCredit.get('paidAmount')?.valueChanges.subscribe((item)=>{
      paidAmount = item;
      if(creditAmount < paidAmount ){
        this.frmCredit.get('remainingAmount')?.setValue(0);
          return
        }
      remainingAmount = creditAmount - paidAmount;
      this.frmCredit.get('remainingAmount')?.setValue(remainingAmount);
    })

  }

  //POST package
  onSubmit(){
    this.submitted = true;
    if (this.frmCredit.invalid) {
      // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
      return;
    }
    this.credit = this.frmCredit.value;
    if(this.frmCredit?.get('$key')?.value == null){
      // this.credit.date = moment(this.frmCredit.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveCredit(this.credit).then((response: any) => {
        if (response) {
          // this.toaster.successToastr('Data saved successfully. ', 'Success!',{showCloseButton: true});
          this.getCredits();
          jQuery('#addCredit').modal('hide');
          //  this.getpackage();
        } else {
          // this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});

        }
      }, (error: HttpErrorResponse) => {
        // this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});
        return;
      });
    }
    else{
      // this.credit.date = moment(this.frmCredit.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.updateCredit(this.credit);
      if (this.subscription) {
        // this.toaster.successToastr('Credit updated successfully. ', 'Success!',{showCloseButton: true});
        this.getCredits();
        jQuery('#addCredit').modal('hide');
        //  this.getpackage();
      } else {
        // this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});
      }
    }
  }
  get f() { return this.frmCredit.controls; }


  //GET credits
  getCredits(){
    this.commonService.getCredits().subscribe((response : any)=>{
      if (response) {
        this.credits = response.map((item:any)=>{
          return {
            $key: item.key,
            ...item.payload.val()
          }
        });
        console.log('this.credits');
        console.log(this.credits);
      }else {
        // this.toaster.errorToastr('No credit found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('No credit found!.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  //Edit package
  editCredit(data: CreditModel){
    this.frmCredit.controls?.['date']?.setValue(this.dateConverter(data.date));
    this.frmCredit.controls?.['name']?.setValue(data.name);
    this.frmCredit.controls?.['creditAmount']?.setValue(data.creditAmount);
    this.frmCredit.controls?.['paidAmount']?.setValue(data.paidAmount);
    this.frmCredit.controls?.['remainingAmount']?.setValue(data.remainingAmount);
    this.frmCredit.controls?.['$key']?.setValue(data.$key);
  }

  //Delete package
  deleteCredit(id:any){
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

    //     let response =  this.commonService.deleteCredit(id);
    //     if (response) {
    //       // this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
    //       this.getCredits();
    //     }else {
    //       // this.toaster.errorToastr('Error while deleting credit.', 'Oops!',{showCloseButton: true});
    //     }
    //   }
    // });
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
    this.frmCredit.reset();
    this.submitted = false;
  }
}
