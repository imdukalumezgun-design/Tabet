import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AppData, Product, Client, Invoice, Supplier, ProductReturn, PurchaseOrder, Payment, SupplierPayment } from './types';
import { loadData, saveData, exportData, importData } from './services/storageService';

// Pages
import Dashboard from './pages/Dashboard';
import StockPage from './pages/StockPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import SettingsPage from './pages/SettingsPage';
import InvoiceViewPage from './pages/InvoiceViewPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierDetailsPage from './pages/SupplierDetailsPage';
import ReturnsPage from './pages/ReturnsPage';
import PurchasesPage from './pages/PurchasesPage';
import PurchaseViewPage from './pages/PurchaseViewPage';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addProduct = (p: Product) => setData(prev => ({ ...prev, products: [...prev.products, p] }));
  const updateProduct = (p: Product) => setData(prev => ({ ...prev, products: prev.products.map(x => x.id === p.id ? p : x) }));
  const deleteProduct = (id: string) => setData(prev => ({ ...prev, products: prev.products.filter(x => x.id !== id) }));

  const addClient = (c: Client) => setData(prev => ({ ...prev, clients: [...prev.clients, c] }));
  const updateClient = (c: Client) => setData(prev => ({ ...prev, clients: prev.clients.map(x => x.id === c.id ? c : x) }));
  const deleteClient = (id: string) => setData(prev => ({ ...prev, clients: prev.clients.filter(x => x.id !== id) }));

  const addSupplier = (s: Supplier) => setData(prev => ({ ...prev, suppliers: [...prev.suppliers, s] }));
  const updateSupplier = (s: Supplier) => setData(prev => ({ ...prev, suppliers: prev.suppliers.map(x => x.id === s.id ? s : x) }));
  const deleteSupplier = (id: string) => setData(prev => ({ ...prev, suppliers: prev.suppliers.filter(x => x.id !== id) }));

  const createInvoice = (invoice: Invoice) => {
    setData(prev => ({
      ...prev,
      invoices: [invoice, ...prev.invoices],
      products: prev.products.map(p => {
        const item = invoice.items.find(i => i.productId === p.id);
        return item ? { ...p, stock: p.stock - item.quantity } : p;
      }),
      clients: prev.clients.map(c => c.id === invoice.clientId ? { ...c, totalDebt: c.totalDebt + invoice.remainingAmount } : c)
    }));
  };

  const updateInvoicePayment = (id: string, newPaid: number) => {
    setData(prev => {
      const inv = prev.invoices.find(x => x.id === id);
      if (!inv) return prev;
      const diff = newPaid - inv.paidAmount;
      return {
        ...prev,
        invoices: prev.invoices.map(x => x.id === id ? { ...x, paidAmount: newPaid, remainingAmount: x.totalAmount - newPaid } : x),
        clients: prev.clients.map(c => c.id === inv.clientId ? { ...c, totalDebt: c.totalDebt - diff } : c)
      };
    });
  };

  const addPayment = (payment: Payment) => {
    setData(prev => ({
      ...prev,
      payments: [payment, ...prev.payments],
      clients: prev.clients.map(c => c.id === payment.clientId ? { ...c, totalDebt: c.totalDebt - payment.amount } : c)
    }));
  };

  const addSupplierPayment = (pay: SupplierPayment) => {
    setData(prev => ({
      ...prev,
      supplierPayments: [pay, ...prev.supplierPayments],
      suppliers: prev.suppliers.map(s => s.id === pay.supplierId ? { ...s, totalDebt: s.totalDebt - pay.amount } : s)
    }));
  };

  const addReturn = (ret: ProductReturn) => {
    setData(prev => ({
      ...prev,
      returns: [ret, ...prev.returns],
      products: prev.products.map(p => p.id === ret.productId ? { ...p, stock: p.stock + ret.quantity } : p),
      clients: prev.clients.map(c => c.id === ret.clientId ? { ...c, totalDebt: c.totalDebt - ret.totalRefund } : c)
    }));
  };

  const addPurchase = (pur: PurchaseOrder) => {
    setData(prev => ({
      ...prev,
      purchases: [pur, ...prev.purchases],
      products: prev.products.map(p => {
        const item = pur.items.find(i => i.productId === p.id);
        return item ? { ...p, stock: p.stock + item.quantity } : p;
      }),
      suppliers: prev.suppliers.map(s => s.id === pur.supplierId ? { ...s, totalDebt: s.totalDebt + pur.totalAmount } : s)
    }));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard data={data} />} />
          <Route path="/stock" element={<StockPage products={data.products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />} />
          <Route path="/clients" element={<ClientsPage clients={data.clients} onAdd={addClient} onUpdate={updateClient} onDelete={deleteClient} />} />
          <Route path="/clients/:id" element={<ClientDetailsPage clients={data.clients} invoices={data.invoices} payments={data.payments} returns={data.returns} companyInfo={data.companyInfo} onAddPayment={addPayment} />} />
          <Route path="/suppliers" element={<SuppliersPage suppliers={data.suppliers} onAdd={addSupplier} onUpdate={updateSupplier} onDelete={deleteSupplier} />} />
          <Route path="/suppliers/:id" element={<SupplierDetailsPage data={data} onAddPayment={addSupplierPayment} />} />
          <Route path="/invoices" element={<InvoicesPage invoices={data.invoices} clients={data.clients} />} />
          <Route path="/invoices/new" element={<CreateInvoicePage data={data} onCreate={createInvoice} />} />
          <Route path="/invoices/:id" element={<InvoiceViewPage invoices={data.invoices} clients={data.clients} companyInfo={data.companyInfo} onUpdatePayment={updateInvoicePayment} onUpdateStatus={(id, s) => setData(p => ({ ...p, invoices: p.invoices.map(x => x.id === id ? { ...x, deliveryStatus: s } : x) }))} />} />
          <Route path="/returns" element={<ReturnsPage data={data} onAddReturn={addReturn} />} />
          <Route path="/purchases" element={<PurchasesPage data={data} onAddPurchase={addPurchase} />} />
          <Route path="/purchases/:id" element={<PurchaseViewPage purchases={data.purchases} companyInfo={data.companyInfo} />} />
          <Route path="/settings" element={<SettingsPage companyInfo={data.companyInfo} onUpdateInfo={i => setData(p => ({ ...p, companyInfo: i }))} onBackup={() => exportData(data)} onRestore={async f => setData(await importData(f) || data)} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;