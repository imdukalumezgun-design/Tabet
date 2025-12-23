import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../types';
import { Plus, Trash2, Edit2, Search, Phone, Wallet, Eye } from 'lucide-react';

interface ClientsPageProps {
  clients: Client[];
  onAdd: (c: Client) => void;
  onUpdate: (c: Client) => void;
  onDelete: (id: string) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({ name: '', phone: '', address: '', nif: '', nis: '', carteFellah: '' });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', phone: '', address: '', nif: '', nis: '', carteFellah: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) onUpdate({ ...editingClient, ...formData } as Client);
    else onAdd({ id: Date.now().toString(), totalDebt: 0, ...formData } as Client);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Répertoire Clients</h2>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={20}/> Client</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" placeholder="Nom du client..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-black"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
          <div key={client.id} className="bg-white p-5 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-black">{client.name}</h3>
                <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(client)} className="text-blue-500"><Edit2 size={16}/></button>
                    {client.id !== '1' && <button onClick={() => onDelete(client.id)} className="text-red-500"><Trash2 size={16}/></button>}
                </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p className="flex items-center gap-2"><Phone size={14}/> {client.phone || '-'}</p>
                {client.carteFellah && <p className="text-xs font-bold text-green-700">Fellah: {client.carteFellah}</p>}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-gray-500">Solde</span>
                <span className={`font-bold text-lg ${client.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>{client.totalDebt.toLocaleString()} DA</span>
            </div>
            <Link to={`/clients/${client.id}`} className="mt-4 block text-center py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">Voir Fiche Complète</Link>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold">Profil Client</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Nom Complet</label>
                    <input required className="w-full border p-2 rounded bg-white text-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Téléphone</label>
                    <input className="w-full border p-2 rounded bg-white text-black" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Carte Fellah</label>
                    <input className="w-full border p-2 rounded bg-white text-black" value={formData.carteFellah} onChange={e => setFormData({...formData, carteFellah: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Adresse</label>
                    <input className="w-full border p-2 rounded bg-white text-black" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">NIF</label>
                    <input className="w-full border p-2 rounded bg-white text-black" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">NIS</label>
                    <input className="w-full border p-2 rounded bg-white text-black" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} />
                </div>
            </div>
            <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded font-bold">Annuler</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;