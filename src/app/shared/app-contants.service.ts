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
    ]
}