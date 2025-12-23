import React, { useState } from 'react';
import { AppData, ProductReturn } from '../types';
import { RotateCcw, Plus, Search, Calendar, User, Package } from 'lucide-react';

interface ReturnsPageProps {
  data: AppData;
  onAddReturn: (ret: ProductReturn) => void;
}

const ReturnsPage: React.FC<ReturnsPageProps> = ({ data, onAddReturn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    quantity: 0,
    unitPrice: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const selectedClient = data.clients.find(c => c.id === formData.clientId);
  const selectedProduct = data.products.find(p => p.id === formData.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedProduct) return;

    const totalRefund = formData.quantity * formData.unitPrice;
    
    const newReturn: ProductReturn = {
      id: Date.now().toString(),
      date: formData.date,
      clientId: formData.clientId,
      clientName: selectedClient.name,
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalRefund: totalRefund
    };

    onAddReturn(newReturn);
    setIsModalOpen(false);
    setFormData({ clientId: '', productId: '', quantity: 0, unitPrice: 0, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <RotateCcw className="text-orange-600" /> Retours de Marchandise
        </h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md">
            <Plus size={20}/> Nouveau Retour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600 uppercase">Historique des Retours</span>
            <span className="text-xs text-gray-500 italic">Total: {data.returns.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-black font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Produit</th>
                <th className="px-6 py-3 text-center">Qté</th>
                <th className="px-6 py-3 text-right">Remboursement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-black font-medium">{new Date(ret.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-black font-bold">{ret.clientName}</td>
                  <td className="px-6 py-4 text-black">{ret.productName}</td>
                  <td className="px-6 py-4 text-center text-black font-bold">{ret.quantity}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-bold">{ret.totalRefund.toLocaleString()} DA</td>
                </tr>
              ))}
              {data.returns.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Aucun retour enregistré.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
                <RotateCcw size={20} className="text-orange-600"/> Enregistrer un Retour
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date du retour</label>
                    <input type="date" required className="w-full border p-2 rounded bg-white text-black" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Choisir le Client</label>
                    <select required className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                        <option value="">-- Sélectionner Client --</option>
                        {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Choisir le Produit</label>
                    <select required className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.productId} onChange={e => {
                        const p = data.products.find(x => x.id === e.target.value);
                        setFormData({...formData, productId: e.target.value, unitPrice: p?.price || 0})
                    }}>
                        <option value="">-- Sélectionner Produit --</option>
                        {data.products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Quantité Retour</label>
                        <input type="number" required min="0.1" step="0.1" className="w-full border p-2 rounded bg-white text-black font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Prix de reprise (DA)</label>
                        <input type="number" required className="w-full border p-2 rounded bg-white text-black font-bold" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} />
                    </div>
                </div>
                {formData.quantity > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-red-600 uppercase">A déduire du solde client</span>
                        <span className="text-lg font-bold text-red-700">{(formData.quantity * formData.unitPrice).toLocaleString()} DA</span>
                    </div>
                )}
            </div>
            <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded font-bold text-gray-700">Annuler</button>
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded font-bold shadow-lg">Confirmer le retour</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReturnsPage;