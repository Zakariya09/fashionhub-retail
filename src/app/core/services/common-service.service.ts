import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ImportModel } from '../../models/import.model';
import { ConfirmModalModel } from '../../common/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
  response = 'true';
  $alertSubject = new Subject();
  $confirmSubject = new Subject<ConfirmModalModel>();
  constructor(
    private http: HttpClient,
  ) { }
  private baseUrl = 'https://fashionhub-retail-default-rtdb.firebaseio.com/';
  private basePath = '/products';


  //Upload Fire Storage Doc
  pushFileToStorage(fileUpload: any, data: any): Observable<number> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    // const storageRef = this.storage.ref(filePath);
    // const uploadTask = this.storage.upload(filePath, fileUpload.file);

    // uploadTask.snapshotChanges().pipe(
    //   finalize(() => {
    //     storageRef.getDownloadURL().subscribe(downloadURL => {
    //       this.toastr.successToastr('File Uploaded Successfully!', 'Success',{showCloseButton: true});
    //       fileUpload.url = downloadURL;
    //       fileUpload.name = fileUpload.file.name;
    //       fileUpload.price = data.price;
    //       fileUpload.productName = data.productName;
    //       this.saveFileData(fileUpload);
    //     });
    //   })
    //   ).subscribe();
    //   return uploadTask.percentageChanges();

    return new Observable();
  }


  //Push File to the Doc
  private saveFileData(fileUpload: any) {
    // this.firebase.list(this.basePath).push(fileUpload);
  }

  //Delete Client
  deleteDocument(id: any) {
    // this.documentsList.remove(id);
    return this.response;
  }

  //GET Documents
  getDocuments() {
    // this.documentsList = this.firebase.list('products');
    // return this.documentsList.snapshotChanges();
    return new Observable();
  }

  //POST Product
  saveProduct(product: any) {
    return this.http.post(this.baseUrl + 'products/', product);
  }

  //POST Product
  saveReceipt(receipt: any) {
    return this.http.post(this.baseUrl + 'receipt/', receipt);
  }

  //Update Product
  updateReceipt(id: any, data: any) {
    return this.http.put(this.baseUrl + 'receipt/' + id, data);
  }

  //GET Rceipt
  getReceipt() {
    return this.http.get(this.baseUrl + 'receipt');
  }

  //Delete Receipt
  deleteReceipt(id: any) {
    return this.http.delete(this.baseUrl + 'receipt/' + id);
  }



  getProducts() {
    return this.http.get(this.baseUrl + 'products');
  }
  //Delete Product
  deleteProduct(id: any) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  getImports() {
    return this.http.get(`${this.baseUrl}imports.json`)?.pipe(map((resp: any) => {
      const importsArr: ImportModel[] = [];
      for (const key in resp) {
        if (resp.hasOwnProperty(key)) {
          importsArr.push({ id: key, ...resp[key] })
        }
      }
      return importsArr;
    }))
  }

  //POST Import
  saveImport(importData: ImportModel, isUpdate: boolean) {
    if (isUpdate) {
      return this.http.put(`${this.baseUrl}imports/${importData?.id}.json`, importData)
    }else{
      return this.http.post<ImportModel>(`${this.baseUrl}imports.json`, importData);
    }
  }

  //Delete Import
  deleteImport(id: any) {
    return this.http.delete(`${this.baseUrl}imports/${id}.json`)
  }

  //GET Sales
  getSales() {
    // this.saleList = this.firebase.list('sales');
    // return this.saleList.snapshotChanges();

    return new Observable();
  }

  //POST Sale
  saveSale(saleData: any) {
    // return  this.saleList.push({
    //   date: saleData.date,
    //   actualAmount: saleData.actualAmount,
    //   saleAmount: saleData.saleAmount,
    //   profitAmount: saleData.profitAmount,
    // });

    return new Promise(() => { });

  }

  //Update Sale
  updateSale(saleData: any) {
    // this.saleList.update(saleData.$key,
    //   {
    //     date: saleData.date,
    //     actualAmount: saleData.actualAmount,
    //     saleAmount: saleData.saleAmount,
    //     profitAmount: saleData.profitAmount,
    //   });
    return JSON.parse(this.response)
  }

  //Delete Product
  deleteSale(id: any) {
    // this.saleList.remove(id);
    return this.response;
  }


  //GET Sales
  getCredits() {
    // this.creditList = this.firebase.list('credits');
    // return this.creditList.snapshotChanges();

    return new Observable();
  }
  //POST Sale
  saveCredit(creditData: any) {
    // return  this.creditList.push({
    //   date: creditData.date,
    //   name: creditData.name,
    //   creditAmount: creditData.creditAmount,
    //   paidAmount: creditData.paidAmount,
    //   remainingAmount: creditData.remainingAmount,
    // });
    return new Promise(() => {

    });

  }

  //Update Product
  updateCredit(creditData: any) {
    // this.creditList.update(creditData.$key,
    //   {
    //     date: creditData.date,
    //     name: creditData.name,
    //     creditAmount: creditData.creditAmount,
    //     paidAmount: creditData.paidAmount,
    //     remainingAmount: creditData.remainingAmount,
    //   });
    return JSON.parse(this.response)
  }

  //Delete Credit
  deleteCredit(id: any) {
    // this.creditList.remove(id);
    return this.response;
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
}
