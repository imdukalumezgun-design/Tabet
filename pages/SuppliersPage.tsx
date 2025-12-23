import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Supplier } from '../types';
import { Plus, Trash2, Edit2, Search, Phone, Briefcase, Eye } from 'lucide-react';

interface SuppliersPageProps {
  suppliers: Supplier[];
  onAdd: (s: Supplier) => void;
  onUpdate: (s: Supplier) => void;
  onDelete: (id: string) => void;
}

const SuppliersPage: React.FC<SuppliersPageProps> = ({ suppliers, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({ name: '', phone: '', address: '', nif: '', nis: '' });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({ name: '', phone: '', address: '', nif: '', nis: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) onUpdate({ ...editingSupplier, ...formData } as Supplier);
    else onAdd({ id: Date.now().toString(), totalDebt: 0, ...formData } as Supplier);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion Fournisseurs</h2>
        <button onClick={() => handleOpenModal()} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md">
            <Plus size={20}/> Nouveau Fournisseur
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" placeholder="Rechercher un fournisseur..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-black font-medium"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(supplier => (
          <div key={supplier.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <Briefcase className="text-slate-400" size={18}/>
                    <h3 className="font-bold text-lg text-black">{supplier.name}</h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(supplier)} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                    <button onClick={() => onDelete(supplier.id)} className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </div>
            </div>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p className="flex items-center gap-2 font-medium"><Phone size={14}/> {supplier.phone || '-'}</p>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Dette (Ce qu'on lui doit)</span>
                    <span className="font-bold text-lg text-slate-900">{supplier.totalDebt.toLocaleString()} DA</span>
                </div>
                <Link to={`/suppliers/${supplier.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-wider hover:bg-black transition-colors">
                    <Eye size={16}/> Voir Fiche & Régler
                </Link>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold border-b pb-2">Profil Fournisseur</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Nom de l'Etablissement / Nom</label>
                    <input required className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Téléphone</label>
                    <input className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Adresse</label>
                    <input className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">NIF</label>
                    <input className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">NIS</label>
                    <input className="w-full border p-2 rounded bg-white text-black font-medium" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} />
                </div>
            </div>
            <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded font-bold text-gray-700">Annuler</button>
                <button type="submit" className="flex-1 bg-slate-800 text-white py-2 rounded font-bold">Sauvegarder</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;