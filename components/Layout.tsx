import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, FileText, Settings, Menu, X, Truck, RotateCcw, Briefcase } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Stock', href: '/stock', icon: Package },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Fournisseurs', href: '/suppliers', icon: Briefcase },
    { name: 'Facturation', href: '/invoices', icon: FileText },
    { name: 'Retours Clients', href: '/returns', icon: RotateCcw },
    { name: 'Commandes Achat', href: '/purchases', icon: Truck },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:block print:bg-white print:h-auto">
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center no-print">
        <span className="font-bold text-lg">AgroPro</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`
        fixed md:static inset-0 z-40 bg-slate-800 text-white w-64 transform transition-transform duration-200 ease-in-out no-print
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="text-green-400" />
            AgroGestion Pro
          </h1>
        </div>
        <nav className="mt-4 px-2 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive(item.href) ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-700'}
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 h-screen print:h-auto print:overflow-visible print:p-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;