import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Client, Invoice, AppData, Payment, ProductReturn } from '../types';
import { ArrowLeft, Phone, MapPin, Wallet, FileText, Printer, Download, PlusCircle, History, RotateCcw } from 'lucide-react';

interface ClientDetailsPageProps {
  clients: Client[];
  invoices: Invoice[];
  payments: Payment[];
  returns: ProductReturn[];
  companyInfo: AppData['companyInfo'];
  onAddPayment: (p: Payment) => void;
}

const ClientDetailsPage: React.FC<ClientDetailsPageProps> = ({ clients, invoices, payments, returns, companyInfo, onAddPayment }) => {
  const { id } = useParams<{ id: string }>();
  const client = clients.find(c => c.id === id);
  
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [isVersementModalOpen, setIsVersementModalOpen] = useState(false);
  const [versementData, setVersementData] = useState({ amount: 0, date: new Date().toISOString().split('T')[0], note: '' });

  if (!client) return <div className="p-8 text-center text-red-600 font-bold">Client introuvable</div>;

  const filteredHistory = useMemo(() => {
    const invs = invoices.filter(inv => inv.clientId === client.id).map(i => ({ ...i, type: 'FACT' }));
    const pays = payments.filter(p => p.clientId === client.id).map(p => ({ ...p, type: 'VERS' }));
    const rets = returns.filter(r => r.clientId === client.id).map(r => ({ ...r, type: 'RETO' }));
    
    let combined = [...invs, ...pays, ...rets];
    if (dateStart) combined = combined.filter(x => x.date >= dateStart);
    if (dateEnd) combined = combined.filter(x => x.date <= dateEnd);
    
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, payments, returns, client.id, dateStart, dateEnd]);

  const stats = useMemo(() => {
    const rangeInvoices = invoices.filter(inv => inv.clientId === client.id && (!dateStart || inv.date >= dateStart) && (!dateEnd || inv.date <= dateEnd));
    const rangePayments = payments.filter(p => p.clientId === client.id && (!dateStart || p.date >= dateStart) && (!dateEnd || p.date <= dateEnd));
    const rangeReturns = returns.filter(r => r.clientId === client.id && (!dateStart || r.date >= dateStart) && (!dateEnd || r.date <= dateEnd));

    const purchased = rangeInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const returnsTotal = rangeReturns.reduce((acc, r) => acc + r.totalRefund, 0);
    const paid = rangeInvoices.reduce((acc, inv) => acc + inv.paidAmount, 0) + 
                 rangePayments.reduce((acc, p) => acc + p.amount, 0);

    return { purchased, paid, returnsTotal };
  }, [invoices, payments, returns, client.id, dateStart, dateEnd]);

  const handleAddVersement = (e: React.FormEvent) => {
    e.preventDefault();
    if (versementData.amount <= 0) return;
    onAddPayment({
        id: Date.now().toString(),
        date: versementData.date,
        clientId: client.id,
        clientName: client.name,
        amount: versementData.amount,
        note: versementData.note
    });
    setIsVersementModalOpen(false);
    setVersementData({ amount: 0, date: new Date().toISOString().split('T')[0], note: '' });
  };

  const downloadPDF = () => {
    const element = document.getElementById('print-area');
    const opt = {
      margin: 10,
      filename: `releve_${client.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <Link to="/clients" className="text-black hover:text-blue-600">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-black text-black">Compte Client: {client.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={() => setIsVersementModalOpen(true)} className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-black border-2 border-black shadow-md">
                <PlusCircle size={18} /> Nouveau Versement
            </button>
            <button onClick={downloadPDF} className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-black border-2 border-black">
                <Download size={18} /> PDF
            </button>
            <button onClick={() => window.print()} className="flex-1 md:flex-none bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-black border-2 border-black">
                <Printer size={18} /> Imprimer
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-black flex flex-wrap gap-4 items-end no-print">
         <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-black text-black uppercase mb-1">Date Début</label>
            <input type="date" className="w-full border-2 border-black rounded-lg p-2 text-sm text-black bg-white font-black" value={dateStart} onChange={e => setDateStart(e.target.value)} />
         </div>
         <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-black text-black uppercase mb-1">Date Fin</label>
            <input type="date" className="w-full border-2 border-black rounded-lg p-2 text-sm text-black bg-white font-black" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
         </div>
         <button onClick={() => {setDateStart(''); setDateEnd('')}} className="bg-white border-2 border-black px-4 py-2 rounded-lg text-sm font-black text-black hover:bg-black hover:text-white transition-colors">Effacer Filtres</button>
      </div>

      <div id="print-area" className="space-y-6">
        <div className="bg-white p-6 rounded-xl border-2 border-black flex justify-between items-start text-black">
            <div className="flex gap-4">
                {companyInfo.logo && <img src={companyInfo.logo} className="w-20 h-20 object-contain" alt="Logo" />}
                <div>
                    <h1 className="text-xl font-black uppercase text-black">{companyInfo.name}</h1>
                    <p className="text-xs font-black text-black">{companyInfo.address}</p>
                    <p className="text-xs font-black text-black">RC: {companyInfo.rc} | NIF: {companyInfo.nif}</p>
                    <p className="text-sm font-black text-black">Tél: {companyInfo.phone}</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-lg font-black underline uppercase text-black">Etat de Compte Client</h2>
                <p className="text-sm font-black text-black">{client.name}</p>
                <p className="text-[10px] font-black italic text-black">Période: {dateStart || 'Toutes dates'} au {dateEnd || 'ce jour'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-black">
            <div className="bg-white p-4 rounded-xl border-2 border-black">
                <span className="text-[10px] font-black uppercase text-black">Achats (+)</span>
                <p className="text-xl font-black text-black">{stats.purchased.toLocaleString()} DA</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-black">
                <span className="text-[10px] font-black uppercase text-black">Retours (-)</span>
                <p className="text-xl font-black text-black">{stats.returnsTotal.toLocaleString()} DA</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-black">
                <span className="text-[10px] font-black uppercase text-black">Versé (-)</span>
                <p className="text-xl font-black text-black">{stats.paid.toLocaleString()} DA</p>
            </div>
            <div className="bg-black p-4 rounded-xl border-2 border-black shadow-lg">
                <span className="text-[10px] font-black uppercase text-white/70">Dette Finale</span>
                <p className="text-xl font-black text-white">{client.totalDebt.toLocaleString()} DA</p>
            </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-black overflow-hidden text-black">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b-2 border-black">
                    <tr className="text-black font-black uppercase text-[10px]">
                        <th className="px-4 py-3 border-r-2 border-black">Date</th>
                        <th className="px-4 py-3 border-r-2 border-black">Détails de l'Opération</th>
                        <th className="px-4 py-3 text-right border-r-2 border-black">Débit (+)</th>
                        <th className="px-4 py-3 text-right">Crédit (-)</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                    {filteredHistory.map((item: any) => (
                        <tr key={item.id} className="font-black text-black">
                            <td className="px-4 py-3 border-r-2 border-black">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 border-r-2 border-black">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black">
                                            {item.type === 'FACT' ? `FACTURE N° ${item.number}` : item.type === 'RETO' ? `RETOUR` : `VERSEMENT`}
                                        </span>
                                    </div>
                                    {item.type === 'FACT' && (
                                        <div className="text-[11px] font-bold mt-1 text-black bg-gray-50 p-1 rounded">
                                            {item.items.map((it: any) => `${it.productName} (x${it.quantity})`).join(', ')}
                                        </div>
                                    )}
                                    {item.type === 'RETO' && (
                                        <div className="text-[11px] font-bold text-black italic">
                                            Article: {item.productName} (x{item.quantity})
                                        </div>
                                    )}
                                    {item.type === 'VERS' && item.note && (
                                        <div className="text-[11px] font-bold text-black">Note: {item.note}</div>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right border-r-2 border-black">
                                {item.type === 'FACT' ? item.totalAmount.toLocaleString() : '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                                {item.type === 'VERS' ? item.amount.toLocaleString() : item.type === 'RETO' ? item.totalRefund.toLocaleString() : item.paidAmount > 0 ? item.paidAmount.toLocaleString() : '-'}
                            </td>
                        </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-black font-black italic">Aucun mouvement trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isVersementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 no-print text-black">
            <form onSubmit={handleAddVersement} className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl border-2 border-black">
                <h3 className="text-xl font-black text-black border-b-2 border-black pb-2">Nouveau Versement</h3>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Montant Versé (DA)</label>
                    <input required type="number" className="w-full border-2 border-black p-3 rounded-lg text-2xl font-black bg-white text-black" 
                        value={versementData.amount || ''} onChange={e => setVersementData({...versementData, amount: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Date</label>
                    <input required type="date" className="w-full border-2 border-black p-2 rounded-lg bg-white text-black font-black" 
                        value={versementData.date} onChange={e => setVersementData({...versementData, date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-black text-black mb-1">Observation</label>
                    <input className="w-full border-2 border-black p-2 rounded-lg bg-white text-black font-black" placeholder="Note ou mode de paiement"
                        value={versementData.note} onChange={e => setVersementData({...versementData, note: e.target.value})} />
                </div>
                <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setIsVersementModalOpen(false)} className="flex-1 border-2 border-black bg-gray-100 py-3 rounded font-black text-black">Annuler</button>
                    <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded font-black border-2 border-black shadow-md">Valider</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsPage;