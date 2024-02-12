import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AppConstants {
    IMPORT_GRID_COLUMNS: string[] = [
        '#', 'Date', 'Amount', 'Description', 'Action'
    ];
}