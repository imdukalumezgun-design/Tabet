export interface Product {
  id: string;
  reference?: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalDebt: number;
  nif?: string;
  nis?: string;
  carteFellah?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalDebt: number;
  nif?: string;
  nis?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  number: string;
  clientId: string;
  clientName: string;
  clientAddress?: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  deliveryStatus: 'pending' | 'delivered';
}

export interface ProductReturn {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalRefund: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'pending' | 'received';
}

export interface Payment {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  amount: number;
  note?: string;
}

export interface SupplierPayment {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  note?: string;
}

export interface AppData {
  products: Product[];
  clients: Client[];
  suppliers: Supplier[];
  invoices: Invoice[];
  returns: ProductReturn[];
  purchases: PurchaseOrder[];
  payments: Payment[];
  supplierPayments: SupplierPayment[];
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    nif?: string;
    nis?: string;
    rc?: string;
    logo?: string;
  }
}