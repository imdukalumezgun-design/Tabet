import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppData, SupplierPayment } from '../types';
import { ArrowLeft, Phone, MapPin, Wallet, Truck, Printer, Download, PlusCircle, History } from 'lucide-react';

interface SupplierDetailsPageProps {
  data: AppData;
  onAddPayment: (p: SupplierPayment) => void;
}

const SupplierDetailsPage: React.FC<SupplierDetailsPageProps> = ({ data, onAddPayment }) => {
  const { id } = useParams<{ id: string }>();
  const supplier = data.suppliers.find(s => s.id === id);
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payData, setPayData] = useState({ amount: 0, date: new Date().toISOString().split('T')[0], note: '' });

  if (!supplier) return <div className="p-8 text-center text-red-500 font-bold">Fournisseur introuvable</div>;

  const history = useMemo(() => {
    const purs = data.purchases.filter(p => p.supplierId === supplier.id).map(p => ({ ...p, type: 'ACHAT' }));
    const pays = data.supplierPayments.filter(p => p.supplierId === supplier.id).map(p => ({ ...p, type: 'PAYE' }));
    return [...purs, ...pays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.purchases, data.supplierPayments, supplier.id]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (payData.amount <= 0) return;
    onAddPayment({
        id: Date.now().toString(),
        date: payData.date,
        supplierId: supplier.id,
        supplierName: supplier.name,
        amount: payData.amount,
        note: payData.note
    });
    setIsPayModalOpen(false);
    setPayData({ amount: 0, date: new Date().toISOString().split('T')[0], note: '' });
  };

  const downloadPDF = () => {
    const element = document.getElementById('supplier-area');
    // @ts-ignore
    html2pdf().from(element).set({ margin: 10, filename: `etat_fournisseur_${supplier.name}.pdf` }).save();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <Link to="/suppliers" className="flex items-center gap-2 text-gray-600 font-bold hover:text-black transition-colors"><ArrowLeft/> Retour</Link>
        <div className="flex gap-2">
            <button onClick={() => setIsPayModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-black border-2 border-black shadow-md">Enregistrer un Paiement</button>
            <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black border-2 border-black"><Download size={18}/></button>
            <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-black border-2 border-black"><Printer size={18}/></button>
        </div>
      </div>

      <div id="supplier-area" className="text-black space-y-6">
        {/* Entête Fournisseur - NOIR PUR */}
        <div className="bg-white p-6 border-2 border-black rounded-xl text-black">
            <h1 className="text-2xl font-black uppercase">{supplier.name}</h1>
            <div className="mt-4 p-4 bg-gray-100 border border-black rounded-lg">
                <p className="text-xs font-black uppercase text-gray-500">Dette Totale envers ce fournisseur :</p>
                <p className="text-3xl font-black text-red-700">{supplier.totalDebt.toLocaleString()} DA</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-bold">
                <p className="flex items-center gap-2"><Phone size={14}/> {supplier.phone || '-'}</p>
                <p className="flex items-center gap-2"><MapPin size={14}/> {supplier.address || '-'}</p>
            </div>
        </div>

        {/* Historique - NOIR PUR */}
        <div className="bg-white rounded-xl border-2 border-black overflow-hidden text-black">
            <table className="w-full text-sm text-black border-collapse">
                <thead className="bg-gray-100 border-b-2 border-black font-black uppercase text-[10px]">
                    <tr>
                        <th className="px-4 py-3 border-r border-black text-black">Date</th>
                        <th className="px-4 py-3 border-r border-black text-black">Opération / Note</th>
                        <th className="px-4 py-3 text-right border-r border-black text-black">Achat (+)</th>
                        <th className="px-4 py-3 text-right text-black">Paiement (-)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black font-bold">
                    {history.map((h: any) => (
                        <tr key={h.id} className="text-black hover:bg-gray-50">
                            <td className="px-4 py-3 border-r border-black">{new Date(h.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 border-r border-black uppercase">
                                {h.type === 'ACHAT' ? 'Facture Achat Stock' : `Paiement: ${h.note || 'Versement'}`}
                            </td>
                            <td className="px-4 py-3 text-right border-r border-black font-black">
                                {h.type === 'ACHAT' ? h.totalAmount.toLocaleString() : '-'}
                            </td>
                            <td className="px-4 py-3 text-right text-green-800 font-black">
                                {h.type === 'PAYE' ? h.amount.toLocaleString() : '-'}
                            </td>
                        </tr>
                    ))}
                    {history.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-10 text-center text-gray-500 italic">Aucune opération avec ce fournisseur.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print">
            <form onSubmit={handlePay} className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 shadow-2xl">
                <h3 className="text-xl font-black text-black border-b-2 border-black pb-2">Régler Fournisseur</h3>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Montant versé (DA)</label>
                    <input required type="number" className="w-full border-2 border-black p-3 rounded-lg bg-white text-black font-black text-xl" 
                        value={payData.amount || ''} onChange={e => setPayData({...payData, amount: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Mode / Note</label>
                    <input placeholder="Ex: Chèque BDL n°..." className="w-full border-2 border-black p-2 rounded-lg bg-white text-black font-bold"
                        value={payData.note} onChange={e => setPayData({...payData, note: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-black border-2 border-black shadow-md">Confirmer le Paiement</button>
                    <button type="button" onClick={() => setIsPayModalOpen(false)} className="w-full py-2 font-bold text-gray-500 hover:text-black">Annuler</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default SupplierDetailsPage;