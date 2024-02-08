import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportModel } from "../../models/import.model";
import { CommonServiceService } from "../../core/services/common-service.service";

declare var jQuery: any;

@Component({
  selector: 'app-manage-import',
  templateUrl: './manage-import.component.html',
  styleUrls: ['./manage-import.component.css']
})
export class ManageImportComponent implements OnInit {
  frmImport!: FormGroup;
  subscription: any;
  p =1;
  submitted = false;
  imports!:any;
  import!:ImportModel;
  textSearch:string = '';

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmImport =  this.formBuilder.group({
      id: [null],
      date: ['',Validators.required],
      amount: [, Validators.required],
      description: [""]
    });
    this.getImports();
  }

   //POST package
   onSubmit(){
    console.log(this.frmImport.value);
    this.submitted = true;
    if (this.frmImport.invalid) {
      // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
         return;
     }
     this.import = this.frmImport.value;

     if(this.frmImport.get('id')?.value == null){
    //  this.import.date = moment(this.frmImport.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveImport(this.import).subscribe((response: any) => {
        console.log('response')
        console.log(response)
      if (response) {
      //  this.toaster.successToastr('data saved successfully. ', 'Success!',{showCloseButton: true});
       this.getImports();
       jQuery('#addImport').modal('hide');
      //  this.getpackage();
      } else {
      // this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  else{
    // this.import.date = moment(this.frmImport.value.date).format('DD-MM-YYYY') ;
    this.subscription = this.commonService.updateImport(this.import).subscribe((response:any)=>{
        console.log('update response')
        console.log(response)
    })
      if (this.subscription) {
      //  this.toaster.successToastr('Package updated successfully. ', 'Success!',{showCloseButton: true});
       this.getImports();
       jQuery('#addImport').modal('hide');
      //  this.getpackage();
      } else {
      // this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});
      }
    }
  }
  get f() { return this.frmImport.controls; }

 //GET package
 getImports(){
  this.commonService.getImports().subscribe((response : any)=>{
    console.log('this.imports');
    console.log(response);
    if (response) {
      this.imports = response;
      console.log('this.imports');
      console.log(this.imports);

    }else {
      // this.toaster.errorToastr('No data found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('No data found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}

//Edit package
 editImport(data: ImportModel){
  this.frmImport.controls['date']?.setValue(this.dateConverter(data.date));
  this.frmImport.controls['amount']?.setValue(data.amount);
  this.frmImport.controls['description']?.setValue(data.description);
  this.frmImport.controls['id']?.setValue(data.id);
 }

 //Delete package
 deleteImport(id:any){


  this.commonService.deleteImport(id).subscribe()
//   Swal.fire({
//     title: 'Are you sure?',
//     text: 'You will not be able to recover this record!',
//     icon: 'warning',
//     showCancelButton: true,
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Delete',
//     cancelButtonText: 'Cancel'
//   })
//   .then((result) => {
//     if (result.value) {

//  let response =  this.commonService.deleteImport(id)
//     if (response) {
//       // this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
//       this.getImports();
//     }else {
//       // this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
//       }
//     }});
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
  this.frmImport.reset();
  this.submitted = false;
}
}
