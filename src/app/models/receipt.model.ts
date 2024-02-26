export interface ProductModel {
  _id: Number
  name: String,
  receiptDate: String,
  taxableAmount: Number,
  cgst: Number,
  sgst: Number,
  grandTotal: Number,
  products: String
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
  grandTotal!: number;
  products!: ProductModel[];
  gst!: number
}
