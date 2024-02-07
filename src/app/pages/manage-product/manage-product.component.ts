import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../../models/product.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { FileUpload } from '../../models/fileupload.model';
declare var jQuery: any;

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  frmProduct!: FormGroup;
  dir = 'http://localhost:3000/';
  product!: ProductModel;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  products!:any [];
  selectedFile!: FileList;
  selectedFiles!: FileList;
  percentage!: number;
  currentFileUpload:any;
  productDetails!:{};
  // @ViewChild('addProduct', {static: false}) public addProduct: ModalDirective;

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmProduct =  this.formBuilder.group({
      $key: [0],
      productName: [, ],
      price: [, Validators.required],
      productImage: [, Validators.required]
    })
    this.getProducts();
  }

  // save project data
  onSubmit() {
    const payload = new FormData();
    payload.append('name', this.frmProduct?.get('name')?.value);
    payload.append('price', this.frmProduct?.get('price')?.value);
    // payload.append('productImage', this.selectedFile, this.selectedFile.name);

    this.submitted = true;

    // stop here if form is invalid
    if (this.frmProduct.invalid) {
      // // this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
      return;
    }
    this.subscription = this.commonService.saveProduct(payload).subscribe((response: any) => {
      if (response.status) {
        // this.toaster.successToastr('Product saved successfully. ', 'Success!',{showCloseButton: true});
        jQuery('#addProduct').modal('hide');
        this.getProducts();
      } else {
        // this.toaster.errorToastr(response.message, 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      // this.toaster.errorToastr('Error while saving product!', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  get f() { return this.frmProduct.controls; }

  //GET products
  // getProducts(){
  //   this.commonService.getProducts().subscribe((response : any)=>{
  //     if (response.status) {
  //       this.products = response.products;
  //     }else {
  // //       this.toaster.errorToastr('No product found!.', 'Oops!',{showCloseButton: true});
  //     }
  //   }, (error: HttpErrorResponse) => {
  // //     this.toaster.errorToastr('No product found!.', 'Oops!',{showCloseButton: true});
  //     return;
  //   });
  // }

  editProduct(data: ProductModel){
    //  data.productImage = data.productImage.slice(7);
    this.frmProduct?.controls['name'].setValue(data.name);
    this.frmProduct?.controls['price'].setValue(data.price);
    this.frmProduct?.controls['productImage'].patchValue(data.productImage);
    this.frmProduct?.controls['_id'].setValue(data._id);
  }

  //Delete Product
  // deleteProduct(id){
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
  //       this.commonService.deleteProduct(id).subscribe((response : any)=>{
  //         if (response.status) {
  // //           this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
  //           this.getProducts();

  //         }else {
  // //           this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
  //         }
  //       }, (error: HttpErrorResponse) => {
  // //         this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
  //         return;
  //       });
  //     }});

  //   }
    //Image assignment
    onFileSelected(event:any) {
      this.selectedFile = event.target.files;
    }
    // clear form value
    clearForm() {
      this.frmProduct.reset();
      this.submitted = false;
    }

    //Upload Images
    upload() {
      const file = this.selectedFile?.item(0);
     this.productDetails = this.frmProduct.value;
      console.log('productDetails');
      console.log(this.productDetails);
      // this.selectedFile = undefined;
      // this.currentFileUpload = new FileUpload(file);
      this.commonService.pushFileToStorage(this.currentFileUpload,this.productDetails ).subscribe(
        percentage => {
          this.percentage = Math.round(percentage);
          if(this.percentage == 100){
            jQuery('#addProduct').modal('hide');
          }
        },
        error => {
          console.log(error);
        }
        );
      }

      //GET Produsct
      getProducts() {
        this.subscription = this.commonService.getDocuments(
          ).subscribe((response: any) => {
            if (response) {
              this.products = response.map((item:any, index:any)=>{
                return {
                  $key: item.key,
                  ...item.payload.val(),
                  index : index
                }
              });
console.log('this.products');
console.log(this.products);

            } else {
              // this.toaster.errorToastr(response.message, 'Oops!', {showCloseButton: true});
              // if (!this.check) {
              //   this.dtTrigger.next();
              //   this.check = true;
              // } else {
              //   this.rerender();
              // }
            }
          }, (error: HttpErrorResponse) => {
            // this.toaster.errorToastr(error.error.message, 'Oops!',{showCloseButton: true});
            // if (!this.check) {
            //   this.dtTrigger.next();
            //   this.check = true;
            // } else {
            //   this.rerender();
            // }
            return;
          });
        }

        //Delete Document
        delete(id:any) {
          // Swal.fire({
          //   title: "Are you sure?",
          //   text: "You will not be able to recover this record!",
          //   icon: "warning",
          //   showCancelButton: true,
          //   cancelButtonColor: "#d33",
          //   confirmButtonText: "Delete",
          //   cancelButtonText: "Cancel",
          // }).then((result) => {
          //   if (result.value) {
          //     let response =   this.commonService.deleteDocument(id)
          //     if(response){
          //       Swal.fire("Deleted!", "Record has been deleted.", "success");
          //       this.getProducts();
          //     }else {
          //       // this.toaster.errorToastr('Error while deleting client', "Oops!", {
          //         showCloseButton: true,
          //       });
              }

            }
        
