import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppData, Invoice, InvoiceItem, Product, Client } from '../types';
import { Plus, Trash2, Save, ShoppingCart, User, Truck } from 'lucide-react';

interface CreateInvoicePageProps {
  data: AppData;
  onCreate: (inv: Invoice) => void;
}

const CreateInvoicePage: React.FC<CreateInvoicePageProps> = ({ data, onCreate }) => {
  const navigate = useNavigate();
  
  // Invoice Header State
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDelivered, setIsDelivered] = useState(true); // Default to delivered
  
  // Invoice Items State
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  // Adding Item State
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0); // Allow overriding price

  // Payment State
  const [paidAmount, setPaidAmount] = useState(0);

  const selectedClient = data.clients.find(c => c.id === selectedClientId);
  const currentProduct = data.products.find(p => p.id === currentProductId);

  // Auto-fill price when product selected
  useEffect(() => {
    if (currentProduct) {
      setCurrentPrice(currentProduct.price);
    }
  }, [currentProduct]);

  // Calculations
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const remainingAmount = totalAmount - paidAmount;

  const handleAddItem = () => {
    if (!currentProduct || currentQty <= 0) return;

    const newItem: InvoiceItem = {
      productId: currentProduct.id,
      productName: currentProduct.name,
      unit: currentProduct.unit,
      quantity: currentQty,
      unitPrice: currentPrice,
      total: currentQty * currentPrice
    };

    setItems([...items, newItem]);
    // Reset selection
    setCurrentProductId('');
    setCurrentQty(1);
    setCurrentPrice(0);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = () => {
    if (!selectedClientId || items.length === 0) {
      alert("Veuillez sélectionner un client et ajouter des produits.");
      return;
    }

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      date,
      number: `FAC-${Date.now().toString().slice(-6)}`,
      clientId: selectedClientId,
      clientName: selectedClient?.name || 'Inconnu',
      clientAddress: selectedClient?.address,
      items,
      totalAmount,
      paidAmount,
      remainingAmount,
      deliveryStatus: isDelivered ? 'delivered' : 'pending'
    };

    onCreate(newInvoice);
    navigate('/invoices');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingCart className="text-blue-600" />
        Nouvelle Facture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} /> Information Client
          </h3>
          <div className="space-y-4">
             <div>
               <label className="block text-sm text-gray-700 mb-1">Client</label>
               <select 
                 className="w-full border rounded-lg p-2 bg-white text-gray-900 font-medium"
                 value={selectedClientId}
                 onChange={(e) => setSelectedClientId(e.target.value)}
               >
                 <option value="" className="text-gray-500">-- Sélectionner un client --</option>
                 {data.clients.map(c => (
                   <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                 ))}
               </select>
             </div>
             <div>
               <label className="block text-sm text-gray-700 mb-1">Date</label>
               <input 
                 type="date" 
                 className="w-full border rounded-lg p-2 bg-white text-gray-900"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
               />
             </div>
             {selectedClient && selectedClient.address && (
                <div className="p-2 bg-gray-50 rounded border text-sm text-gray-800 font-medium">
                  Adresse: {selectedClient.address}
                </div>
             )}
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={18} /> Ajouter Produit
          </h3>
          <div className="space-y-3">
             <div>
               <select 
                 className="w-full border rounded-lg p-2 bg-white text-gray-900 font-medium"
                 value={currentProductId}
                 onChange={(e) => setCurrentProductId(e.target.value)}
               >
                 <option value="" className="text-gray-500">-- Choisir Produit --</option>
                 {data.products.map(p => (
                   <option key={p.id} value={p.id} className="text-gray-900">
                     {p.name} {p.reference ? `(${p.reference})` : ''} - Stock: {p.stock}
                   </option>
                 ))}
               </select>
             </div>
             
             <div className="flex gap-2">
               <div className="flex-1">
                 <input 
                   type="number" 
                   placeholder="Qté" 
                   className="w-full border rounded-lg p-2 bg-white text-gray-900 font-medium"
                   value={currentQty}
                   onChange={(e) => setCurrentQty(Number(e.target.value))}
                   min="0.1"
                   step="0.1"
                 />
               </div>
               <div className="flex-1">
                 <input 
                   type="number" 
                   placeholder="Prix" 
                   className="w-full border rounded-lg p-2 bg-white text-gray-900 font-medium"
                   value={currentPrice}
                   onChange={(e) => setCurrentPrice(Number(e.target.value))}
                 />
               </div>
               <button 
                onClick={handleAddItem}
                disabled={!currentProductId}
                className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold"
               >
                 <Plus />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Produit</th>
              <th className="px-6 py-3 text-center">Qté</th>
              <th className="px-6 py-3 text-right">Prix U.</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{item.productName}</td>
                <td className="px-6 py-3 text-center text-gray-900">{item.quantity} {item.unit}</td>
                <td className="px-6 py-3 text-right text-gray-900">{item.unitPrice.toLocaleString()}</td>
                <td className="px-6 py-3 text-right font-bold text-gray-900">{item.total.toLocaleString()}</td>
                <td className="px-6 py-3 text-center">
                  <button onClick={() => handleRemoveItem(idx)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucun article ajouté
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-end gap-6">
        
        {/* Delivery Status */}
        <div className="w-full md:w-auto">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
                <input 
                    type="checkbox" 
                    className="w-5 h-5 text-green-600 rounded"
                    checked={isDelivered}
                    onChange={e => setIsDelivered(e.target.checked)}
                />
                <div className="flex items-center gap-2">
                    <Truck size={20} className={isDelivered ? 'text-green-600' : 'text-gray-400'} />
                    <span className="font-medium text-gray-900">Produits Livrés ?</span>
                </div>
            </label>
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div className="flex justify-between text-lg text-gray-900">
            <span>Total HT:</span>
            <span className="font-bold">{totalAmount.toLocaleString()} DA</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-700 w-24">Versé:</span>
            <input 
              type="number" 
              className="flex-1 border border-gray-300 rounded p-1 text-right font-bold bg-white text-gray-900"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
            <span className="text-gray-900">Reste (Crédit):</span>
            <span className={`font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {remainingAmount.toLocaleString()} DA
            </span>
          </div>

          <button 
            onClick={handleSaveInvoice}
            className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 flex justify-center items-center gap-2 font-semibold"
          >
            <Save size={20} /> Enregistrer la Facture
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoicePage;