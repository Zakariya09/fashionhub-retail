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
        '#', 'Date', 'Buyer Name', 'Credit Amount', 'Paid Amount', 'Remaining Amount', 'Action'
    ];
}