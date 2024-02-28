export interface ProductModel {
  id: Number
  name: String,
  receiptDate: String,
  taxableAmount: Number,
  cgst: Number,
  sgst: Number,
  grandTotal: Number,
  products: String,
}

export class InvoiceModel {
  customerName!: string;
  productName!: string;
  quantity!: number;
  receiptDate!: string;
  rate!: number;
  taxableAmount!: number;
  gst!: number;
  cgst!: number;
  sgst!: number;
  igst!: number;
  total!: number
}

export class ReceiptModel {
  id!: string;
  name!: string;
  mobileNumber!: number;
  receiptDate!: string;
  taxableAmount!: number;
  cgst!: number;
  sgst!: number;
  igst!: number;
  grandTotal!: number;
  products!: ProductModel[];
  gst!: number
}

export class ReceiptProduct {
  name!: string;
  taxableAmount!: number;
  totalInWords!: string;
  mobileNumber!: string;
  igst!: number;
  cgst!: number;
  sgst!: number;
  receiptDate!: string;
  grandTotal!: number;
  products!: Product[];
}

export interface Product {
  productName: string,
  quantity: number,
  rate: number,
  taxableAmount: number,
  gst: number,
  cgst: number,
  sgst: number,
  igst: number,
  total: number
}