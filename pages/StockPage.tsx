import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';

interface StockPageProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const StockPage: React.FC<StockPageProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    reference: '', name: '', unit: 'sac', price: 0, stock: 0
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ reference: '', name: '', unit: 'sac', price: 0, stock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) onUpdate({ ...editingProduct, ...formData } as Product);
    else onAdd({ id: Date.now().toString(), ...formData } as Product);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-black">Gestion de Stock</h2>
        <button onClick={() => handleOpenModal()} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-black border-2 border-black shadow-md">
            <Plus size={20}/> Ajouter Produit
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
        <input 
          type="text" placeholder="Rechercher un produit..." 
          className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg bg-white text-black font-black"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-black overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-black font-black uppercase text-xs border-b-2 border-black">
            <tr>
              <th className="px-6 py-4 border-r-2 border-black">Réf</th>
              <th className="px-6 py-4 border-r-2 border-black">Désignation</th>
              <th className="px-6 py-4 border-r-2 border-black text-center">Unité</th>
              <th className="px-6 py-4 border-r-2 border-black text-right">Prix (DA)</th>
              <th className="px-6 py-4 border-r-2 border-black text-center">Stock</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black text-black font-black">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-r-2 border-black font-mono">{p.reference || '-'}</td>
                <td className="px-6 py-4 border-r-2 border-black text-black uppercase">{p.name}</td>
                <td className="px-6 py-4 border-r-2 border-black text-center uppercase">{p.unit}</td>
                <td className="px-6 py-4 border-r-2 border-black text-right text-black">{p.price.toLocaleString()}</td>
                <td className="px-6 py-4 border-r-2 border-black text-center">
                    <span className={`px-2 py-1 rounded border-2 border-black ${p.stock < 10 ? 'bg-red-600 text-white' : 'bg-green-200 text-black'}`}>
                        {p.stock}
                    </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-3">
                    <button onClick={() => handleOpenModal(p)} className="text-blue-700 bg-blue-50 p-2 rounded border border-blue-200"><Edit2 size={18}/></button>
                    <button onClick={() => onDelete(p.id)} className="text-red-700 bg-red-50 p-2 rounded border border-red-200"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 text-black">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl border-2 border-black">
            <h3 className="text-xl font-black border-b-2 border-black pb-2 uppercase">{editingProduct ? 'Modifier' : 'Nouveau'} Produit</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-black text-black mb-1">Nom du produit</label>
                    <input required className="w-full border-2 border-black p-2 rounded bg-white text-black font-black uppercase" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Unité</label>
                    <select className="w-full border-2 border-black p-2 rounded bg-white text-black font-black" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                        <option value="sac">Sac</option>
                        <option value="Qt">Quintal (Qt)</option>
                        <option value="kg">Kg</option>
                        <option value="unite">Unité</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Prix de Vente (DA)</label>
                    <input required type="number" className="w-full border-2 border-black p-2 rounded bg-white text-black font-black" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Stock Initial</label>
                    <input required type="number" className="w-full border-2 border-black p-2 rounded bg-white text-black font-black" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Référence (Facult.)</label>
                    <input className="w-full border-2 border-black p-2 rounded bg-white text-black font-black" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
                </div>
            </div>
            <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 border-2 border-black py-3 rounded font-black text-black">Annuler</button>
                <button type="submit" className="flex-1 bg-green-600 text-white border-2 border-black py-3 rounded font-black shadow-md">Sauvegarder</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StockPage;