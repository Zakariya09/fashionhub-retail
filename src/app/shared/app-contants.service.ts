import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AppConstants {
    IMPORT_GRID_COLUMNS: string[] = [
        '#', 'Date', 'Amount', 'Description', 'Action'
    ];

    SALES_GRID_COLUMNS: string[] = [
        '#', 'Date', 'Actual Amount', 'Sale Amount', 'Profit Amount', 'Action'
    ];

    CREDIT_GRID_COLUMNS: string[] = [
        '#', 'Date', 'Customer Name', 'Product Price', 'Paid Amount', 'Remaining Amount', 'Action'
    ];

    RECEIPT_GRID_COLUMNS: string[] = [
        '#', 'Receipt Date', 'Customer Name', 'Receipt Amount', 'Action'
    ];

    RECEIPT_PRINT_GRID_COLUMNS: string[] = [
        'Sr. No.', 'Particulars', 'Qty.', 'Rate', 'Taxable Amount', 'GST (%)', 'CGST Amount', 'SGST Amount', 'IGST Amount', 'TOTAL'
    ];

    RECEIPT_INVOICE_COLUMNS: string[] = ['#',
        'Product',
        'Quantity',
        'Rate',
        'Taxable Amount',
        'GST (%)',
        'CGST',
        'SGST',
        'IGST',
        'Total',
        'Action'
    ];

    PRODUCT_GRID_COLUMNS: string[] = [
        '#', 'Name', 'Actual Price', 'Selling Price', 'Stock', 'Image', 'Action'
    ];

    CLOTH_TYPES:string[]=[ 'Top','Bottom'];

    TOP_FITTING_TYPES:string[]=[ 'Skinny Fit', 'Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Loose Fit'];

    TOP_SIZES:Sizes[]=[{id:'6', value:'S', isChecked:false}, 
        {id:'1', value:'M', isChecked:false},
        {id:'2', value:'L', isChecked:false},
        {id:'3', value:'XL', isChecked:false},
        {id:'4', value:'XXl', isChecked:false},
        {id:'5', value:'XXXL', isChecked:false}];

        BOTTOM_SIZES:Sizes[]=[
        {id:'1', value:'28', isChecked:false},
        {id:'2', value:'30', isChecked:false},
        {id:'3', value:'32', isChecked:false},
        {id:'4', value:'34', isChecked:false},
        {id:'5', value:'36', isChecked:false}];
}

export class Sizes{
    id!:string;
    value!:string;
    isChecked?:boolean;

}