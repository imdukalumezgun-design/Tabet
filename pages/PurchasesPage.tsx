import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppData, PurchaseOrder, InvoiceItem } from '../types';
import { Truck, Plus, Trash2, Calendar, Briefcase, Package, Eye } from 'lucide-react';

interface PurchasesPageProps {
  data: AppData;
  onAddPurchase: (pur: PurchaseOrder) => void;
}

const PurchasesPage: React.FC<PurchasesPageProps> = ({ data, onAddPurchase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  // Item form
  const [currentProdId, setCurrentProdId] = useState('');
  const [currentQty, setCurrentQty] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  const selectedSupplier = data.suppliers.find(s => s.id === supplierId);

  const handleAddItem = () => {
    const prod = data.products.find(p => p.id === currentProdId);
    if (!prod || currentQty <= 0) return;

    const newItem: InvoiceItem = {
      productId: prod.id,
      productName: prod.name,
      unit: prod.unit,
      quantity: currentQty,
      unitPrice: currentPrice,
      total: currentQty * currentPrice
    };
    setItems([...items, newItem]);
    setCurrentProdId('');
    setCurrentQty(0);
    setCurrentPrice(0);
  };

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || items.length === 0) return;

    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

    const newPurchase: PurchaseOrder = {
      id: Date.now().toString(),
      date,
      supplierId: supplierId,
      supplierName: selectedSupplier.name,
      items: items,
      totalAmount: totalAmount,
      status: 'received'
    };

    onAddPurchase(newPurchase);
    setIsModalOpen(false);
    setItems([]);
    setSupplierId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="text-blue-600" /> Commandes & Achats Stock
        </h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md">
            <Plus size={20}/> Faire un Achat
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-black font-bold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Fournisseur</th>
                <th className="px-6 py-3">Produits</th>
                <th className="px-6 py-3 text-right">Montant Total</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.purchases.map((pur) => (
                <tr key={pur.id} className="hover:bg-gray-50 font-bold text-black">
                  <td className="px-6 py-4">{new Date(pur.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{pur.supplierName}</td>
                  <td className="px-6 py-4 font-normal text-xs">
                    {pur.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-700">{pur.totalAmount.toLocaleString()} DA</td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/purchases/${pur.id}`} className="text-blue-600 flex justify-center items-center gap-1 hover:underline"><Eye size={16}/> Voir/Imprimer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
                <Truck size={20} className="text-blue-600"/> Nouvelle Entrée de Stock
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Fournisseur</label>
                    <select className="w-full border p-2 rounded bg-white text-black font-medium" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                        <option value="">-- Choisir Fournisseur --</option>
                        {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date Achat</label>
                    <input type="date" className="w-full border p-2 rounded bg-white text-black font-medium" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="md:col-span-2">
                        <select className="w-full border p-2 rounded text-sm bg-white text-black" value={currentProdId} onChange={e => {
                            const p = data.products.find(x => x.id === e.target.value);
                            setCurrentProdId(e.target.value);
                            setCurrentPrice(p?.price || 0);
                        }}>
                            <option value="">-- Produit --</option>
                            {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div><input type="number" placeholder="Qté" className="w-full border p-2 rounded text-sm bg-white text-black" value={currentQty || ''} onChange={e => setCurrentQty(Number(e.target.value))} /></div>
                    <div><input type="number" placeholder="P.U Achat" className="w-full border p-2 rounded text-sm bg-white text-black" value={currentPrice || ''} onChange={e => setCurrentPrice(Number(e.target.value))} /></div>
                </div>
                <button type="button" onClick={handleAddItem} className="w-full py-2 bg-green-600 text-white rounded font-bold text-xs uppercase">Ajouter à la liste</button>
            </div>

            <div className="border rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-black font-bold">
                        <tr>
                            <th className="px-4 py-2">Produit</th>
                            <th className="px-4 py-2 text-center">Qté</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-black">
                        {items.map((it, idx) => (
                            <tr key={idx} className="font-bold">
                                <td className="px-4 py-2">{it.productName}</td>
                                <td className="px-4 py-2 text-center">{it.quantity} {it.unit}</td>
                                <td className="px-4 py-2 text-right">{it.total.toLocaleString()}</td>
                                <td className="px-4 py-2 text-center"><button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500"><Trash2 size={14}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSavePurchase} disabled={!supplierId || items.length === 0} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black shadow-lg">VALIDER L'ACHAT</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-500 font-bold">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesPage;