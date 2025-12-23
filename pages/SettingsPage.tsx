import React, { useState } from 'react';
import { AppData } from '../types';
import { Save, Download, Upload, Image as ImageIcon } from 'lucide-react';

interface SettingsPageProps {
  companyInfo: AppData['companyInfo'];
  onUpdateInfo: (info: AppData['companyInfo']) => void;
  onBackup: () => void;
  onRestore: (file: File) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ companyInfo, onUpdateInfo, onBackup, onRestore }) => {
  const [infoForm, setInfoForm] = useState(companyInfo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInfoForm({ ...infoForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInfo(infoForm);
    alert('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Paramètres Généraux</h2>

      <section className="bg-white p-6 rounded-xl shadow-sm border text-black">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Informations de l'Etablissement</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo Upload */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 mb-2 relative group">
                      {infoForm.logo ? (
                          <img src={infoForm.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                          <ImageIcon size={40} className="text-gray-300" />
                      )}
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Logo (Document)</span>
                  {infoForm.logo && <button type="button" onClick={() => setInfoForm({...infoForm, logo: ''})} className="text-[10px] text-red-500 font-bold mt-1">Supprimer</button>}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Désignation Commerciale</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.name} onChange={e => setInfoForm({...infoForm, name: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Adresse Siège</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.address} onChange={e => setInfoForm({...infoForm, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Téléphone Principal</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.phone} onChange={e => setInfoForm({...infoForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Registre Commerce (RC)</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.rc || ''} onChange={e => setInfoForm({...infoForm, rc: e.target.value})} placeholder="N° RC..." />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">NIF</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.nif} onChange={e => setInfoForm({...infoForm, nif: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">NIS</label>
                    <input className="w-full border p-2 rounded-lg bg-white text-black font-bold" value={infoForm.nis} onChange={e => setInfoForm({...infoForm, nis: e.target.value})} />
                  </div>
              </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-lg hover:bg-blue-700 transition-colors">
              <Save size={20}/> ENREGISTRER LES INFOS
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Système & Sauvegarde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={onBackup} className="bg-green-50 text-green-800 p-6 rounded-xl flex flex-col items-center gap-2 hover:bg-green-100 border border-green-200 transition-colors">
                <Download size={32}/>
                <span className="font-black uppercase">Exporter ma sauvegarde</span>
                <span className="text-[10px] italic">Télécharger un fichier .json</span>
            </button>
            <div className="relative group">
                <input type="file" accept=".json" onChange={e => e.target.files && onRestore(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="bg-orange-50 text-orange-800 p-6 rounded-xl flex flex-col items-center gap-2 border border-orange-200 group-hover:bg-orange-100 transition-colors">
                    <Upload size={32}/>
                    <span className="font-black uppercase">Restaurer des données</span>
                    <span className="text-[10px] italic">Charger un fichier de sauvegarde</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;