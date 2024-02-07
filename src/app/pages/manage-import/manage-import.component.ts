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
  textSearch = '';
  userData = JSON.parse(localStorage.getItem('userData') || '');
  imports!:any;
  import!:ImportModel;
  // @ViewChild('addImport', {static: false}) public addImport: ModalDirective;

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmImport =  this.formBuilder.group({
      $key: [null],
      date: ['',Validators.required],
      amount: [, Validators.required],
      description: [""]
    });
    this.getImports();
  }

   //POST package
   onSubmit(){
    this.submitted = true;
    if (this.frmImport.invalid) {
      // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
         return;
     }
     this.import = this.frmImport.value;

     if(this.frmImport.get('$key')?.value == null){
    //  this.import.date = moment(this.frmImport.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveImport(this.import).then((response: any) => {
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
    this.subscription = this.commonService.updateImport(this.import);
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
    if (response) {
      this.imports = response.map((item:any)=>{
        return {
          $key: item.key,
          ...item.payload.val()
        }
      });
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
  this.frmImport.controls['key']?.setValue(data.$key);
 }

 //Delete package
 deleteImport(id:any){
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
