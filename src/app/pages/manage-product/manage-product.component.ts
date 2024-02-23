import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../../models/product.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Firestore } from '@angular/fire/firestore';
declare var jQuery: any;
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  frmProduct!: FormGroup;
  p = 1;
  submitted = false;
  products!: any[];
  selectedFile!: FileList;
  percentage: number = 0;
  currentFileUpload: boolean = false;
  productDetails!: ProductModel;
  textSearch: string = '';
  isUpdate!: boolean;
  subscription = new Subject();
  warningText: string = '';
  appStrings: any;
  PRODUCT_GRID_COLUMNS: string[] = [];
  firestore = inject(Firestore);
  selectedProduct!: ProductModel;

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.frmProduct = this.formBuilder.group({
      id: [],
      name: [, Validators.required],
      price: [, Validators.required],
      productImage: [, Validators.required]
    });
    this.PRODUCT_GRID_COLUMNS = this.appConstants.PRODUCT_GRID_COLUMNS;
    this.appStrings = this.appStringsService.appStrings;
    this.getProducts();
  }

  /**
   * upload image and save product data
   */
  upload() {
    this.submitted = true;

    const file: any = this.selectedFile?.item(0);
    this.productDetails = this.frmProduct.value;
    this.currentFileUpload = true;

    console.log(this.productDetails);

    const storage = getStorage();
    const storageRef = ref(storage, `products/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        this.percentage = Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('error here...')
        this.currentFileUpload = false;
        this.commonService.$alertSubject?.next({
          type: 'danger',
          showAlert: true,
          message: this.utilityService.getErrorText(error?.message)
        });
      },
      () => {
        this.f['productImage'].setValue(null);
        this.currentFileUpload = false;
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.productDetails.productImage = downloadURL;
          this.saveProduct();
        });
      }
    );
  }

  /**
   * save product data
   */
  saveProduct(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.commonService.saveProduct(this.productDetails, this.isUpdate)?.pipe(takeUntil(this.subscription)).subscribe(() => {
      this.getProducts();
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.isUpdate = false;
      jQuery('#addProduct').modal('hide');
    }, (error: HttpErrorResponse) => {
      console.log('error text')
      console.log(error)
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  get f() { return this.frmProduct.controls; }

  getProducts(): void {
    this.warningText = 'Loading Data...';
    this.commonService.getProducts().pipe(takeUntil(this.subscription)).subscribe((response: ProductModel[]) => {
      this.products = response;
      console.log('this.products');
      console.log(this.products);
      this.warningText = 'No Data Found!';
    }, (error: HttpErrorResponse) => {
      console.log('error text')
      console.log(error)
      this.warningText = 'No Data Found!';
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }


  editProduct(data: ProductModel) {
    this.isUpdate = true;
    this.frmProduct.reset();
    this.frmProduct.get('name')?.setValue(data.name);
    this.frmProduct.get('id')?.setValue(data.id);
    this.frmProduct.get('price')?.setValue(data.price);
    this.selectedProduct = JSON.parse(JSON.stringify(data));
    // delete data.productImage;
    // this.frmProduct.patchValue(data);
  }

  //Image assignment
  onFileSelected(event: any) {
    this.selectedFile = event.target.files;
  }
  // clear form value
  clearForm() {
    this.frmProduct.reset();
    this.submitted = false;
  }


  deleteProductImage(product: ProductModel) {

    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, product.productImage);

    // Delete the file
    deleteObject(desertRef).then(() => {
      jQuery('#addProduct').modal('hide');
      this.getProducts();
    }).catch((error) => {
      console.log('error text')
      console.log(error)
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });


    console.log('product');
    console.log(product);
  }
  //Delete Document
  delete(id: any) {
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

