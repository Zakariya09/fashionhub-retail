import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
export class ManageProductComponent implements OnInit, OnDestroy {
  frmProduct!: FormGroup;
  p = 1;
  submitted = false;
  products!: any[];
  selectedFile!: FileList;
  percentage: number = 0;
  currentFileUpload: boolean = false;
  textSearch: string = '';
  isUpdate!: boolean;
  subscription = new Subject();
  warningText: string = '';
  appStrings: any;
  PRODUCT_GRID_COLUMNS: string[] = [];
  firestore = inject(Firestore);
  selectedProduct!: any;
  isRecordDelete: boolean = false;
  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.PRODUCT_GRID_COLUMNS = this.appConstants.PRODUCT_GRID_COLUMNS;
    this.appStrings = this.appStringsService.appStrings;
    this.getProducts();
  }

  /**
   * initializing product form
   */
  initializeForm() {
    this.frmProduct = this.formBuilder.group({
      id: [],
      name: [, Validators.required],
      price: [, Validators.required],
      productImage: [, Validators.required]
    });
  }

  /**
   * upload image and save product data
   */
  upload(): void {
    const imageUrl = this.selectedProduct?.productImage;
    this.submitted = true;
    const file: any = this.selectedFile?.item(0);
    if (this.selectedProduct?.productImage && file == undefined) {
      this.selectedProduct = this.frmProduct.value;
      this.selectedProduct.productImage = imageUrl;
      this.saveProduct();
      return
    } else if (this.selectedProduct?.productImage && file) {
      this.deleteExtraImage(imageUrl)
    }
    this.selectedProduct = this.frmProduct.value;
    this.currentFileUpload = true;
    const storage = getStorage();
    const storageRef = ref(storage, `products/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        this.percentage = Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
        }
      },
      (error) => {
        this.currentFileUpload = false;
        this.commonService.$alertSubject?.next({
          type: 'danger',
          showAlert: true,
          message: this.utilityService.getErrorText(error?.message)
        });
      },
      () => {
        this.currentFileUpload = false;
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.selectedProduct.productImage = downloadURL;
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
    this.commonService.saveProduct(this.selectedProduct, this.isUpdate)?.pipe(takeUntil(this.subscription)).subscribe(() => {
      this.getProducts();
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.isUpdate = false;
      jQuery('#addProduct').modal('hide');
      this.f['productImage'].setValue(null);
    }, (error: HttpErrorResponse) => {
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * returning product form controls
   */
  get f() { return this.frmProduct.controls; }

  /**
   * get product list
   */
  getProducts(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService.getProducts().pipe(takeUntil(this.subscription)).subscribe((response: ProductModel[]) => {
      this.products = response;
      if (this.products?.length == 0) {
        this.warningText = this.appStrings['noDataFound'];
      }
    }, (error: HttpErrorResponse) => {
      this.warningText = this.appStrings['noDataFound'];
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * 
   * @param imageUrl 
   */
  deleteExtraImage(imageUrl: string): void {
    const storage = getStorage();
    const desertRef = ref(storage, imageUrl);
    deleteObject(desertRef).then(() => {
    }).catch((error) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * 
   * @param data 
   */
  editProduct(data: ProductModel): void {
    if (data.productImage) {
      this.frmProduct.get('productImage')?.clearValidators();
      this.frmProduct.get('productImage')?.updateValueAndValidity();
    } else {
      this.frmProduct.get('productImage')?.setValidators(Validators.required)
      this.frmProduct.get('productImage')?.updateValueAndValidity();
    }
    this.isRecordDelete = false;
    this.isUpdate = true;
    this.frmProduct.reset();
    this.frmProduct.get('name')?.setValue(data.name);
    this.frmProduct.get('id')?.setValue(data.id);
    this.frmProduct.get('price')?.setValue(data.price);
    this.selectedProduct = data;
  }

  /**
   * 
   * @param event 
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files;
  }

  /**
   * deleting product image
   * @returns 
   */
  deleteProductImage(): void {
    this.commonService.$loaderSubject?.next({ showLoader: true });
    this.isUpdate = true;
    const storage = getStorage();
    if (this.isRecordDelete && !this.selectedProduct.productImage) {
      this.deleteProduct();
      return
    }
    // Create a reference to the file to delete
    const desertRef = ref(storage, this.selectedProduct.productImage);

    // Delete the file
    deleteObject(desertRef).then(() => {
      if (this.isRecordDelete) {
        this.deleteProduct();
      } else {
        this.selectedProduct = this.frmProduct.value;
        this.saveProduct();
        this.commonService.$confirmSubject.next({ showModal: false });
      }
    }).catch((error) => {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
      this.commonService.$loaderSubject?.next({ showLoader: false });
    });
  }

  /**
   * confirm delete popup
   * @param data 
   */
  confirmDelete(data: ProductModel, mode: string): void {
    this.selectedProduct = data;
    this.commonService.$confirmSubject.next({ showModal: true, type: 'delete' });
    this.isRecordDelete = mode == 'record';
  }

  /**
  * delete product record
  */
  deleteProduct(): void {
    this.commonService.deleteProduct(this.selectedProduct?.id)?.pipe(takeUntil(this.subscription)).subscribe((response: any) => {
      this.commonService.$confirmSubject.next({ showModal: false });
      this.commonService.$loaderSubject?.next({ showLoader: false });
      jQuery('#addProduct').modal('hide');
      this.getProducts();
    }, (error: HttpErrorResponse) => {
      this.commonService.$loaderSubject?.next({ showLoader: false });
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.utilityService.getErrorText(error?.message)
      });
    });
  }

  /**
   * clearing data & resetting form values
   */
  clearForm(): void {
    this.selectedProduct = {};
    this.initializeForm();
    this.frmProduct.reset();
    this.isUpdate = false;
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}

