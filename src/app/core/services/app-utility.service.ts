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

    /**
    * Converting nummber into text format
    * @param value 
    * @returns 
    */
    number2text(value: any) {
        var fraction = Math.round(this.frac(value) * 100);
        var f_text = "";
        if (fraction > 0) {
            f_text = "And " + this.convert_number(fraction) + " Paise";
        }
        return this.convert_number(value) + " Rupee " + f_text + " Only";
    }

    /**
     * 
     * @param f 
     * @returns 
     */
    frac(f: any) {
        return f % 1;
    }

    /**
     * 
     * @param number 
     * @returns 
     */
    convert_number(number: any) {
        if ((number < 0) || (number > 999999999)) {
            return "NUMBER OUT OF RANGE!";
        }
        var Gn = Math.floor(number / 10000000);  /* Crore */
        number -= Gn * 10000000;
        var kn = Math.floor(number / 100000);     /* lakhs */
        number -= kn * 100000;
        var Hn = Math.floor(number / 1000);      /* thousand */
        number -= Hn * 1000;
        var Dn = Math.floor(number / 100);       /* Tens (deca) */
        number = number % 100;               /* Ones */
        var tn = Math.floor(number / 10);
        var one = Math.floor(number % 10);
        var res = "";

        if (Gn > 0) {
            res += (this.convert_number(Gn) + " Crore");
        }
        if (kn > 0) {
            res += (((res == "") ? "" : " ") +
                this.convert_number(kn) + " Lakh");
        }
        if (Hn > 0) {
            res += (((res == "") ? "" : " ") +
                this.convert_number(Hn) + " Thousand");
        }

        if (Dn) {
            res += (((res == "") ? "" : " ") +
                this.convert_number(Dn) + " Hundred");
        }

        var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen");
        var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

        if (tn > 0 || one > 0) {
            if (!(res == "")) {
                res += " And ";
            }
            if (tn < 2) {
                res += ones[tn * 10 + one];
            }
            else {

                res += tens[tn];
                if (one > 0) {
                    res += ("-" + ones[one]);
                }
            }
        }

        if (res == "") {
            res = "zero";
        }
        return res;
    }

    /**
   * Printing receipt formatted div element
   * @param div 
   */
  printReceipt(div: any) {
    var divToPrint = document.getElementById(div);
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th,td {' +
      'border:1px solid #000;' +
      'padding:0.3em;' +
      'text-align:center;' +
      '};' +
      '</style>';
    htmlToPrint += divToPrint?.outerHTML;
    let newWin = window.open(`/default/receipt`);
    newWin?.document.write(htmlToPrint);
    newWin?.print();
    newWin?.close();
  }
}