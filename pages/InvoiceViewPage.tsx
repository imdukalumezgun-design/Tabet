import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, AppData, Client } from '../types';
import { ArrowLeft, Printer, CreditCard, Download, CheckCircle, Clock } from 'lucide-react';

interface InvoiceViewPageProps {
  invoices: Invoice[];
  clients: Client[];
  companyInfo: AppData['companyInfo'];
  onUpdatePayment: (id: string, newAmount: number) => void;
  onUpdateStatus: (id: string, status: 'pending' | 'delivered') => void;
}

const InvoiceViewPage: React.FC<InvoiceViewPageProps> = ({ invoices, clients, companyInfo, onUpdatePayment, onUpdateStatus }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoice = invoices.find(inv => inv.id === id);
  const client = clients.find(c => c.id === invoice?.clientId);
  
  const [docType, setDocType] = useState<'invoice' | 'delivery_note'>('invoice');

  if (!invoice) return <div className="p-8 text-center text-red-500 font-bold">Facture introuvable</div>;

  const isBL = docType === 'delivery_note';

  const downloadPDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 10,
      filename: `${isBL ? 'BL' : 'FACT'}_${invoice.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barre d'action */}
      <div className="flex flex-col gap-4 no-print">
        <button onClick={() => navigate('/invoices')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-fit font-black uppercase text-xs">
          <ArrowLeft size={16} /> Retour à la liste
        </button>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex bg-gray-100 p-1 rounded-lg border">
                <button onClick={() => setDocType('invoice')} className={`px-4 py-2 rounded-md text-sm font-black transition-colors ${!isBL ? 'bg-white text-blue-600 shadow-sm border' : 'text-gray-500'}`}>Facture</button>
                <button onClick={() => setDocType('delivery_note')} className={`px-4 py-2 rounded-md text-sm font-black transition-colors ${isBL ? 'bg-white text-blue-600 shadow-sm border' : 'text-gray-500'}`}>B. Livraison</button>
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md border-2 border-black">
                    <Download size={18} /> PDF
                </button>
                <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md border-2 border-black">
                    <Printer size={18} /> Imprimer
                </button>
            </div>
        </div>
      </div>

      {/* DOCUMENT IMPRIMABLE - NOIR SUR BLANC PUR */}
      <div id="invoice-content" className="bg-white p-8 md:p-12 shadow-lg text-black font-serif relative border-2 border-black">
        
        {/* Entête Entreprise */}
        <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-6">
          <div className="flex gap-6 items-center">
            {companyInfo.logo && <img src={companyInfo.logo} alt="Logo" className="w-24 h-24 object-contain" />}
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">{companyInfo.name}</h1>
              <p className="text-sm font-black text-black">{companyInfo.address}</p>
              <div className="text-[10px] space-y-0.5 mt-2 font-black text-black">
                {companyInfo.rc && <p>RC: {companyInfo.rc}</p>}
                {companyInfo.nif && <p>NIF: {companyInfo.nif}</p>}
                {companyInfo.nis && <p>NIS: {companyInfo.nis}</p>}
                <p className="text-sm mt-1">Tél: {companyInfo.phone}</p>
              </div>
            </div>
          </div>
          <div className="text-right text-black">
            <h2 className="text-3xl font-black mb-1">{isBL ? 'BON DE LIVRAISON' : 'FACTURE'}</h2>
            <p className="text-lg font-black">N° {invoice.number}</p>
            <p className="text-md font-black">Date: {new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Infos */}
        <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border-2 border-black rounded-xl text-black">
                <p className="text-[10px] text-black uppercase font-black mb-1">Information Client :</p>
                <h3 className="text-xl font-black uppercase">{invoice.clientName}</h3>
                <p className="text-sm font-bold">{invoice.clientAddress || 'Adresse non spécifiée'}</p>
                <div className="mt-3 space-y-1 text-[11px] font-black">
                    {client?.nif && <p>NIF: {client.nif}</p>}
                    {client?.nis && <p>NIS: {client.nis}</p>}
                    {client?.carteFellah && <p className="text-black bg-gray-200 px-1 inline-block">N° CARTE FELLAH: {client.carteFellah}</p>}
                    {client?.phone && <p>Tél: {client.phone}</p>}
                </div>
            </div>
        </div>

        {/* Tableau Produits - TOUT EN NOIR PUR */}
        <table className="w-full mb-8 border-collapse border-b-2 border-black">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-black">
              <th className="py-2 px-3 text-left font-black text-black text-sm uppercase">Désignation des Articles</th>
              <th className="py-2 text-center font-black text-black text-sm uppercase">Unité</th>
              <th className="py-2 text-center font-black text-black text-sm uppercase">Quantité</th>
              {!isBL && (
                <>
                    <th className="py-2 px-3 text-right font-black text-black text-sm uppercase">P.U (DA)</th>
                    <th className="py-2 px-3 text-right font-black text-black text-sm uppercase">Total (DA)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="text-sm font-black text-black">
                <td className="py-3 px-3 uppercase">{item.productName}</td>
                <td className="py-3 text-center">{item.unit}</td>
                <td className="py-3 text-center text-lg">{item.quantity}</td>
                {!isBL && (
                    <>
                        <td className="py-3 px-3 text-right">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">{item.total.toLocaleString()}</td>
                    </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        {!isBL ? (
            <div className="flex justify-end">
                <div className="w-80 space-y-2 bg-gray-50 p-4 rounded-xl border-2 border-black text-black">
                    <div className="flex justify-between font-black text-sm border-b border-black pb-1">
                        <span>TOTAL HT:</span>
                        <span>{invoice.totalAmount.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between font-black text-sm border-b border-black pb-1">
                        <span>VERSEMENT:</span>
                        <span>{invoice.paidAmount.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-1">
                        <span>RESTE À PAYER:</span>
                        <span>{invoice.remainingAmount.toLocaleString()} DA</span>
                    </div>
                </div>
            </div>
        ) : (
            <div className="mt-10 h-24 border-2 border-dashed border-black rounded-xl flex items-center justify-center text-black font-black uppercase italic">
                Cachet & Signature de réception Marchandise
            </div>
        )}

        {/* Signatures */}
        <div className="mt-20 grid grid-cols-2 gap-20 text-center text-[10px] font-black uppercase text-black">
          <div className="border-t-2 border-black pt-4">Signature Client</div>
          <div className="border-t-2 border-black pt-4">Direction {companyInfo.name}</div>
        </div>

        <div className="mt-12 text-center text-[9px] font-black text-black uppercase border-t pt-2">
          Document généré par AgroGestion Pro - {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewPage;