import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportModel } from '../../models/import.model';
import { ConfirmModalModel } from '../../common/confirm-modal/confirm-modal.component';
import { Loader } from '../../common/loader/loader.component';
import { SaleModel } from '../../models/sale.model';
import { CreditModel } from '../../models/credit.model';
import { Firestore } from '@angular/fire/firestore';
import { ProductModel } from '../../models/product.model';
import { ReceiptModel } from '../../models/receipt.model';
import { ProductType } from '../../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
  response = 'true';
  $alertSubject = new Subject();
  $confirmSubject = new Subject<ConfirmModalModel>();
  $loaderSubject = new Subject<Loader>();
  firestore = inject(Firestore);
  $toggleSubject = new Subject();

  constructor(private http: HttpClient) {}
  private baseUrl = 'https://fashionhub-retail-default-rtdb.firebaseio.com/';

  /**
   *
   * @returns
   */
  getReceipts() {
    return this.http.get<ReceiptModel>(`${this.baseUrl}receipts.json`)?.pipe(
      map((resp: any) => {
        const receiptsArr: ReceiptModel[] = [];
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            receiptsArr.push({ id: key, ...resp[key] });
          }
        }
        return receiptsArr;
      })
    );
  }

  /**
   *
   * @returns
   */
  getReceiptById(id: string) {
    return this.http.get<ReceiptModel>(`${this.baseUrl}receipts/${id}.json`);
  }

  /**
   *
   * @param receiptData
   * @param isUpdate
   * @returns
   */
  saveReceipt(receiptData: ReceiptModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}receipts/${receiptData?.id}.json`,
        receiptData
      );
    } else {
      return this.http.post<ProductModel>(
        `${this.baseUrl}receipts.json`,
        receiptData
      );
    }
  }

  //Update Product
  updateReceipt(id: any, data: any) {
    return this.http.put(this.baseUrl + 'receipt/' + id, data);
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteReceipt(id: any) {
    return this.http.delete(`${this.baseUrl}receipts/${id}.json`);
  }

  /**
   *
   * @returns
   */
  getProducts() {
    return this.http.get<ProductModel>(`${this.baseUrl}products.json`)?.pipe(
      map((resp: any) => {
        const importsArr: ProductModel[] = [];
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            importsArr.push({ id: key, ...resp[key] });
          }
        }
        return importsArr;
      })
    );
  }

  /**
   *
   * @param productData
   * @param isUpdate
   * @returns
   */
  saveProduct(productData: ProductModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}products/${productData?.id}.json`,
        productData
      );
    } else {
      return this.http.post<ProductModel>(
        `${this.baseUrl}products.json`,
        productData
      );
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteProduct(id: any) {
    return this.http.delete(`${this.baseUrl}products/${id}.json`);
  }

  /**
   *
   * @returns
   */
  getImports() {
    return this.http.get<ImportModel>(`${this.baseUrl}imports.json`)?.pipe(
      map((resp: any) => {
        const importsArr: ImportModel[] = [];
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            importsArr.push({ id: key, ...resp[key] });
          }
        }
        return importsArr;
      })
    );
  }

  /**
   *
   * @param importData
   * @param isUpdate
   * @returns
   */
  saveImport(importData: ImportModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}imports/${importData?.id}.json`,
        importData
      );
    } else {
      return this.http.post<ImportModel>(
        `${this.baseUrl}imports.json`,
        importData
      );
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteImport(id: any) {
    return this.http.delete(`${this.baseUrl}imports/${id}.json`);
  }

  /**
   *
   * @returns
   */
  getSales() {
    return this.http.get<SaleModel>(`${this.baseUrl}sales.json`)?.pipe(
      map((resp: any) => {
        const importsArr: SaleModel[] = [];
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            importsArr.push({ id: key, ...resp[key] });
          }
        }
        return importsArr;
      })
    );
  }

  /**
   *
   * @param saleData
   * @param isUpdate
   * @returns
   */
  saveSale(saleData: SaleModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}sales/${saleData?.id}.json`,
        saleData
      );
    } else {
      return this.http.post<SaleModel>(`${this.baseUrl}sales.json`, saleData);
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteSale(id: any) {
    return this.http.delete(`${this.baseUrl}sales/${id}.json`);
  }

  /**
   *
   * @returns
   */
  getCredits() {
    return this.http.get<CreditModel>(`${this.baseUrl}credits.json`)?.pipe(
      map((resp: any) => {
        const crediitsArr: CreditModel[] = [];
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            crediitsArr.push({ id: key, ...resp[key] });
          }
        }
        return crediitsArr;
      })
    );
  }

  /**
   *
   * @param saleData
   * @param isUpdate
   * @returns
   */
  saveCredit(creaditData: CreditModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}credits/${creaditData?.id}.json`,
        creaditData
      );
    } else {
      return this.http.post<CreditModel>(
        `${this.baseUrl}credits.json`,
        creaditData
      );
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteCredit(id: any) {
    return this.http.delete(`${this.baseUrl}credits/${id}.json`);
  }

  //GET Users
  getUsers() {
    return this.http.get(this.baseUrl + 'user');
  }

  //POST User
  saveUser(user: any) {
    return this.http.post(this.baseUrl + 'user/signup', user);
  }

  //Update User
  updateUser(id: any, data: any) {
    return this.http.put(this.baseUrl + 'user/' + id, data);
  }

  //Delete User
  deleteUser(id: any) {
    return this.http.delete(this.baseUrl + 'user/' + id);
  }

  /**
   *
   * @param saleData
   * @param isUpdate
   * @returns
   */
  saveProductType(productTypeData: ProductType, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(
        `${this.baseUrl}product-types/${productTypeData?.id}.json`,
        productTypeData
      );
    } else {
      return this.http.post<ProductType>(
        `${this.baseUrl}product-types.json`,
        productTypeData
      );
    }
  }

  /**
   *
   * @returns
   */
  getProductTypes() {
    return this.http
      .get<ProductType>(`${this.baseUrl}product-types.json`)
      ?.pipe(
        map((resp: any) => {
          const crediitsArr: ProductType[] = [];
          for (const key in resp) {
            if (resp.hasOwnProperty(key)) {
              crediitsArr.push({ id: key, ...resp[key] });
            }
          }
          return crediitsArr;
        })
      );
  }

  /**
   *
   * @param id
   * @returns
   */
  deleteProductType(id: any) {
    return this.http.delete(`${this.baseUrl}product-types/${id}.json`);
  }
}
