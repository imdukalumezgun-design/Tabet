import React from 'react';
import { AppData } from '../types';
import { TrendingUp, AlertTriangle, Users, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  data: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalSales = data.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalDebt = data.clients.reduce((acc, client) => acc + client.totalDebt, 0);
  const lowStockProducts = data.products.filter(p => p.stock < 10);
  const recentInvoices = data.invoices.slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-black">Tableau de Bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black uppercase mb-1">Total Ventes</p>
              <h3 className="text-2xl font-black text-black">{totalSales.toLocaleString()} DA</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 border border-blue-300 rounded-full">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black uppercase mb-1">Dettes Clients</p>
              <h3 className="text-2xl font-black text-red-700">{totalDebt.toLocaleString()} DA</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-full">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black uppercase mb-1">Nombre Clients</p>
              <h3 className="text-2xl font-black text-black">{data.clients.length}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-full">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-black shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black uppercase mb-1">Articles Stock</p>
              <h3 className="text-2xl font-black text-black">{data.products.length}</h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 border border-amber-300 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-black overflow-hidden shadow-sm">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-amber-50">
            <h3 className="font-black text-black flex items-center gap-2 uppercase text-sm">
              <AlertTriangle size={18} />
              Stock Critique (&lt; 10 unités)
            </h3>
            <Link to="/stock" className="text-xs font-black text-amber-700 underline">Voir Tout</Link>
          </div>
          <div className="p-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-black font-black text-center py-4 italic">Tout est en stock suffisant.</p>
            ) : (
              <ul className="divide-y-2 divide-black">
                {lowStockProducts.map(p => (
                  <li key={p.id} className="py-2 flex justify-between items-center text-black font-black">
                    <span className="uppercase">{p.name}</span>
                    <span className="text-red-700 font-black bg-red-50 border border-red-200 px-3 py-1 rounded">
                      {p.stock} {p.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-black overflow-hidden shadow-sm">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
            <h3 className="font-black text-black uppercase text-sm">Derniers Mouvements</h3>
            <Link to="/invoices" className="text-xs font-black text-blue-700 underline">Factures</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-black font-black uppercase bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3 border-r-2 border-black">Date</th>
                  <th className="px-4 py-3 border-r-2 border-black">Client</th>
                  <th className="px-4 py-3 text-right">Total (DA)</th>
                </tr>
              </thead>
              <tbody className="text-black font-black">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b-2 border-black hover:bg-gray-50">
                    <td className="px-4 py-3 border-r-2 border-black">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 border-r-2 border-black uppercase">{inv.clientName}</td>
                    <td className="px-4 py-3 text-right text-black">{inv.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                {recentInvoices.length === 0 && (
                   <tr>
                     <td colSpan={3} className="text-center py-8 text-black font-black italic">Aucune transaction enregistrée.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;