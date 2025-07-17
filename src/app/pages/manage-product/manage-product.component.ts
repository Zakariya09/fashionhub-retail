import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../../models/product.model';
import { CommonServiceService } from '../../core/services/common-service.service';
import { Subject, takeUntil } from 'rxjs';
import { AppConstants, Sizes } from '../../shared/app-contants.service';
import { AppStrings } from '../../shared/app-strings.service';
import { AppUtilityService } from '../../core/services/app-utility.service';
import { Firestore } from '@angular/fire/firestore';
declare var jQuery: any;
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Event } from '@angular/router';
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'],
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
  availableColors: string[] = [];
  deleteModalTitle!: string;
  CLOTH_TYPES!: string[];
  FITTING_TYPES!: string[];
  TOP_SIZES: Sizes[] = [];
  BOTTOM_SIZES: Sizes[] = [];
  sizes!: Sizes[];
  selectedSizes: string[] = [];

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private appStringsService: AppStrings,
    private utilityService: AppUtilityService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.PRODUCT_GRID_COLUMNS = this.appConstants.PRODUCT_GRID_COLUMNS;
    this.appStrings = this.appStringsService.appStrings;
    this.CLOTH_TYPES = this.appConstants?.CLOTH_TYPES;
    this.TOP_SIZES = this.appConstants.TOP_SIZES;
    this.FITTING_TYPES = this.appConstants?.TOP_FITTING_TYPES;
    this.BOTTOM_SIZES = this.appConstants?.BOTTOM_SIZES;

    this.getProducts();
  }

  /**
   * Updating available product colors
   */
  addColors() {
    const slectedColor = this.frmProduct.get('availableColors')?.value;
    if (slectedColor && !this.availableColors.includes(slectedColor)) {
      this.availableColors.push(this.frmProduct.get('availableColors')?.value);
      // console.log('this.availableColors')
      console.log(this.availableColors?.toString());
    }
  }

  /**
   * removing product color
   * @param index
   */
  removeColors(index: number) {
    if (this.availableColors?.length > 1) {
      this.availableColors.splice(index, 1);
      this.frmProduct.get('availableColors')?.setValue(this.availableColors[0]);
    } else {
      this.commonService.$alertSubject?.next({
        type: 'danger',
        showAlert: true,
        message: this.appStringsService.appStrings.leastSelectedColor,
      });
    }
  }

  /**
   *
   * @returns boolean
   */
  validateForm(): boolean | undefined {
    if (!this.isUpdate) {
      return (
        this.frmProduct.invalid ||
        this.frmProduct.get('availableColors')?.invalid ||
        this.availableColors?.length <= 0
      );
    } else {
      return this.frmProduct.invalid;
    }
  }

  /**
   * initializing product form
   */
  initializeForm() {
    this.frmProduct = this.formBuilder.group({
      id: [],
      name: [, Validators.required],
      actualPrice: [, Validators.required],
      sellingPrice: [, Validators.required],
      stock: [, Validators.required],
      productImage: [, Validators.required],
      availableColors: ['#000000', Validators.required],
      clothType: [, Validators.required],
      fittingType: [, Validators.required],
      size: [],
    });
  }

  changeClothType(event: any) {
    console.log(event.target.value);
    this.selectedSizes = [].slice();
    this.sizes =
      event.target.value == 'Top'
        ? [...this.TOP_SIZES]
        : [...this.BOTTOM_SIZES];
    this.sizes.forEach((size) => (size.isChecked = false));
  }

  addSizes(value: string) {
    if (!this.selectedSizes.includes(value)) {
      this.sizes.forEach((item) => {
        if (item.value === value) {
          item.isChecked = true;
        }
        return item;
      });
      this.selectedSizes.push(value);
    } else {
      this.selectedSizes = this.selectedSizes.filter((size) => size !== value);
      this.sizes.forEach((item) => {
        if (item.value === value) {
          item.isChecked = false;
        }
        return item;
      });
    }
    console.log(this.selectedSizes);
    console.log(this.sizes);
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
      return;
    } else if (this.selectedProduct?.productImage && file) {
      this.deleteExtraImage(imageUrl);
    }
    this.selectedProduct = this.frmProduct.value;
    this.currentFileUpload = true;
    const storage = getStorage();
    const storageRef = ref(storage, `products/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.percentage = Math.trunc(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

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
          message: this.utilityService.getErrorText(error?.message),
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
    if (this.frmProduct.invalid) {
      return;
    }
    this.selectedProduct.availableColors = this.availableColors?.toString();
    this.selectedProduct.size = this.selectedSizes?.toString();
    this.commonService.$loaderSubject?.next({ showLoader: true });
    console.log('this.selectedProduct');
    console.log(this.selectedProduct);
    this.commonService
      .saveProduct(this.selectedProduct, this.isUpdate)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        () => {
          this.getProducts();
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.isUpdate = false;
          jQuery('#addProduct').modal('hide');
          this.f['productImage'].setValue(null);
        },
        (error: HttpErrorResponse) => {
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
    this.commonService.$confirmSubject.next({ showModal: false });
  }

  /**
   * returning product form controls
   */
  get f() {
    return this.frmProduct.controls;
  }

  /**
   * get product list
   */
  getProducts(): void {
    this.warningText = this.appStrings['loadingDataText'];
    this.commonService
      .getProducts()
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (response: ProductModel[]) => {
          this.products = response;
          if (this.products?.length == 0) {
            this.warningText = this.appStrings['noDataFound'];
          }
        },
        (error: HttpErrorResponse) => {
          this.warningText = this.appStrings['noDataFound'];
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
  }

  /**
   *
   * @param imageUrl
   */
  deleteExtraImage(imageUrl: string): void {
    const storage = getStorage();
    const desertRef = ref(storage, imageUrl);
    deleteObject(desertRef)
      .then(() => {})
      .catch((error) => {
        this.commonService.$alertSubject?.next({
          type: 'danger',
          showAlert: true,
          message: this.utilityService.getErrorText(error?.message),
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
      this.frmProduct.get('productImage')?.setValidators(Validators.required);
      this.frmProduct.get('productImage')?.updateValueAndValidity();
    }
    this.isRecordDelete = false;
    this.isUpdate = true;
    this.frmProduct.reset();
    this.frmProduct.get('name')?.setValue(data.name);
    this.frmProduct.get('id')?.setValue(data.id);
    this.frmProduct.get('actualPrice')?.setValue(data.actualPrice);
    this.frmProduct.get('sellingPrice')?.setValue(data.sellingPrice);
    this.frmProduct.get('fittingType')?.setValue(data.fittingType);
    this.frmProduct.get('clothType')?.setValue(data.clothType);
    if (data.availableColors?.length) {
      this.availableColors = [...data.availableColors?.split(',')];
      this.frmProduct.get('availableColors')?.setValue(this.availableColors[0]);
    } else {
      this.availableColors = [];
    }
    this.frmProduct.get('stock')?.setValue(data.stock);
    this.selectedProduct = data;
    console.log('data');
    console.log(data);
    this.selectedSizes = data?.size?.split(',');
    if (!this.selectedSizes) {
      this.sizes = [];
    }

    console.log('selectedSizes');
    console.log(this.selectedSizes);
    if (data.clothType == this.CLOTH_TYPES[0]) {
      this.sizes = [...this.TOP_SIZES];
      this.sizes?.forEach(
        (item) => (item.isChecked = this.selectedSizes?.includes(item.value))
      );

      console.log('sizes');
      console.log(this.sizes);
    } else if (data.clothType == this.CLOTH_TYPES[1]) {
      this.sizes = [...this.BOTTOM_SIZES];
      this.sizes?.forEach(
        (item) => (item.isChecked = this.selectedSizes?.includes(item.value))
      );
    }
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
      return;
    }
    // Create a reference to the file to delete
    const desertRef = ref(storage, this.selectedProduct.productImage);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        if (this.isRecordDelete) {
          this.deleteProduct();
        } else {
          this.selectedProduct = this.frmProduct.value;
          this.saveProduct();
          this.commonService.$confirmSubject.next({ showModal: false });
        }
      })
      .catch((error) => {
        console.log('error');
        console.log((error?.message).includes('does not exist'));
        if (error?.message?.includes('does not exist')) {
          this.deleteProduct();
          return;
        }
        this.commonService.$alertSubject?.next({
          type: 'danger',
          showAlert: true,
          message: this.utilityService.getErrorText(error?.message),
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
    this.commonService.$confirmSubject.next({
      showModal: true,
      type: 'delete',
    });
    this.isRecordDelete = mode == 'record';
    this.deleteModalTitle = this.isRecordDelete
      ? this.appStrings.record
      : this.appStrings.image;
  }

  /**
   * delete product record
   */
  deleteProduct(): void {
    this.commonService
      .deleteProduct(this.selectedProduct?.id)
      ?.pipe(takeUntil(this.subscription))
      .subscribe(
        (response: any) => {
          this.commonService.$confirmSubject.next({ showModal: false });
          this.commonService.$loaderSubject?.next({ showLoader: false });
          jQuery('#addProduct').modal('hide');
          this.getProducts();
        },
        (error: HttpErrorResponse) => {
          this.commonService.$loaderSubject?.next({ showLoader: false });
          this.commonService.$alertSubject?.next({
            type: 'danger',
            showAlert: true,
            message: this.utilityService.getErrorText(error?.message),
          });
        }
      );
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
    this.availableColors = [];
    this.sizes = [];
  }

  ngOnDestroy(): void {
    this.subscription.next(false);
  }
}
