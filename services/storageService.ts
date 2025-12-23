
import { AppData } from '../types';

const STORAGE_KEY = 'agro_gestion_data_v2';

// Added missing supplierPayments to DEFAULT_DATA
const DEFAULT_DATA: AppData = {
  products: [
    { id: '1', reference: 'AL-DEM', name: 'Aliment Démarrage', unit: 'Qt', price: 8500, stock: 50 },
  ],
  clients: [
    { id: '1', name: 'Client Passager', phone: '', address: '', totalDebt: 0 },
  ],
  suppliers: [],
  invoices: [],
  returns: [],
  purchases: [],
  payments: [],
  supplierPayments: [],
  companyInfo: {
    name: "ETS MERABET & FILS",
    address: "Route de Barbacha, Amizour - Bejaia",
    phone: "05 60 96 88 58",
    nif: "",
    nis: "",
    logo: ""
  }
};

export const loadData = (): AppData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required arrays exist even if loading from older data version
      return {
        ...DEFAULT_DATA,
        ...parsed,
        products: parsed.products || DEFAULT_DATA.products,
        clients: parsed.clients || DEFAULT_DATA.clients,
        suppliers: parsed.suppliers || [],
        invoices: parsed.invoices || [],
        returns: parsed.returns || [],
        purchases: parsed.purchases || [],
        payments: parsed.payments || [],
        supplierPayments: parsed.supplierPayments || [],
      };
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return DEFAULT_DATA;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: AppData) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `agro_pro_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importData = async (file: File): Promise<AppData | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) throw new Error("Fichier vide");
        const json = JSON.parse(content);
        const merged = { ...DEFAULT_DATA, ...json };
        resolve(merged);
      } catch (e) {
        reject("Erreur de lecture : " + e);
      }
    };
    reader.onerror = () => reject("Erreur FileReader");
    reader.readAsText(file);
  });
};
