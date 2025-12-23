import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Invoice, Client } from '../types';
import { Eye, Plus, Search, FileText, CheckCircle, Clock } from 'lucide-react';

interface InvoicesPageProps {
  invoices: Invoice[];
  clients: Client[];
}

const InvoicesPage: React.FC<InvoicesPageProps> = ({ invoices, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchName = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      inv.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClient = filterClient ? inv.clientId === filterClient : true;
    return matchName && matchClient;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Facturation</h2>
        <Link 
          to="/invoices/new"
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Créer Facture
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par N° ou nom..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-gray-900 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border rounded-lg bg-white text-gray-900"
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
        >
          <option value="">Tous les clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3">N° Facture</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3 text-center">Statut</th>
                <th className="px-6 py-3 text-right">Montant Total</th>
                <th className="px-6 py-3 text-right">Reste</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText size={16} /> {inv.number}
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{inv.clientName}</td>
                  <td className="px-6 py-4 text-center">
                    {inv.deliveryStatus === 'delivered' ? (
                        <div className="flex justify-center" title="Livré">
                            <CheckCircle size={18} className="text-green-500" />
                        </div>
                    ) : (
                        <div className="flex justify-center" title="En attente">
                            <Clock size={18} className="text-yellow-500" />
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{inv.totalAmount.toLocaleString()} DA</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${inv.remainingAmount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {inv.remainingAmount.toLocaleString()} DA
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-1">
                      <Eye size={18} /> Voir
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Aucune facture trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;