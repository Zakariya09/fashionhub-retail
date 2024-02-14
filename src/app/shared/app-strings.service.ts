import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppStrings {

    appStrings = {
        manageImport: 'Manage Import',
        home: 'Home',
        newImport: 'New Import',
        import: 'Import',
        importDate: 'Import Date',
        enterDateText: 'Please enter date.',
        amount: 'Amount',
        enterAmountText: 'Please enter amount.',
        description: 'Description',
        close: 'Close',
        manageSales:'Manage Sale',
        newSale:'New Sale',
        addSale:'Add Sale',
        sellingDate:'Selling Date',
        actualPrice:'Actual Price',
        sellingPrice:'Selling Price',
        enterActualPrice:'Please enter actual price.',
        enterSellingPrice:'Please enter sale price.',
        profit:'Profit',
        enterProfit:'Please enter profit.',
        updateSale:'Update Sale',
    }
}