import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PurchaseOrder, AppData } from '../types';
import { ArrowLeft, Printer, Download } from 'lucide-react';

interface PurchaseViewPageProps {
  purchases: PurchaseOrder[];
  companyInfo: AppData['companyInfo'];
}

const PurchaseViewPage: React.FC<PurchaseViewPageProps> = ({ purchases, companyInfo }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const purchase = purchases.find(p => p.id === id);

  if (!purchase) return <div className="p-8 text-center font-bold">Achat introuvable</div>;

  const downloadPDF = () => {
    const element = document.getElementById('purchase-doc');
    const opt = {
      margin: 10,
      filename: `BC_FOURN_${purchase.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center no-print">
        <button onClick={() => navigate('/purchases')} className="flex items-center gap-2 font-black text-gray-600 hover:text-black uppercase text-xs"><ArrowLeft size={16}/> Retour</button>
        <div className="flex gap-2">
            <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black border-2 border-black shadow-md">PDF</button>
            <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-black border-2 border-black shadow-md"><Printer size={18}/></button>
        </div>
      </div>

      <div id="purchase-doc" className="bg-white p-12 shadow-lg text-black font-serif border-2 border-black">
        <div className="flex justify-between border-b-4 border-black pb-6 mb-6 text-black">
          <div className="flex gap-6 items-center">
            {companyInfo.logo && <img src={companyInfo.logo} className="w-24 h-24 object-contain" alt="Logo" />}
            <div>
              <h1 className="text-2xl font-black uppercase">{companyInfo.name}</h1>
              <p className="text-sm font-bold">{companyInfo.address}</p>
              <p className="text-xs font-bold font-mono">RC: {companyInfo.rc} | NIF: {companyInfo.nif}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black uppercase">Bon de Commande</h2>
            <p className="font-black text-lg">Date: {new Date(purchase.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 border-2 border-black rounded-xl text-black">
            <p className="text-xs uppercase font-black text-gray-500 mb-1">Destinataire (Fournisseur) :</p>
            <h3 className="text-xl font-black uppercase">{purchase.supplierName}</h3>
        </div>

        <table className="w-full mb-8 border-collapse border-b-2 border-black">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-black">
              <th className="py-2 px-3 text-left font-black text-black uppercase">Article Commandé</th>
              <th className="py-2 text-center font-black text-black uppercase">Unité</th>
              <th className="py-2 text-center font-black text-black uppercase">Quantité</th>
              <th className="py-2 px-3 text-right font-black text-black uppercase">P.U Achat</th>
              <th className="py-2 px-3 text-right font-black text-black uppercase">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black font-black text-black">
            {purchase.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 px-3 uppercase">{item.productName}</td>
                <td className="py-3 text-center">{item.unit}</td>
                <td className="py-3 text-center text-lg">{item.quantity}</td>
                <td className="py-3 px-3 text-right">{item.unitPrice.toLocaleString()}</td>
                <td className="py-3 px-3 text-right">{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 p-4 border-2 border-black rounded-xl bg-gray-50 text-black">
            <div className="flex justify-between font-black text-xl uppercase">
              <span>Total :</span>
              <span>{purchase.totalAmount.toLocaleString()} DA</span>
            </div>
          </div>
        </div>

        <div className="mt-24 flex justify-between uppercase font-black text-[10px] text-black">
          <div className="border-t-2 border-black pt-4 w-56 text-center">Cachet Fournisseur</div>
          <div className="border-t-2 border-black pt-4 w-56 text-center">Visa Direction {companyInfo.name}</div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseViewPage;