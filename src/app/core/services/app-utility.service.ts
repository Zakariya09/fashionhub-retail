import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppUtilityService {

    constructor() { }

    getErrorText(error: string): string {
        if (error?.toLocaleLowerCase()?.includes('http failure')) {
            return 'Please check your internet connection and try agian!';
        } else if (typeof error === 'string') {
            return error;
        }
        return 'Something went wrong, please try again!';
    }
}