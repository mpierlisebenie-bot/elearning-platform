import React from 'react';
import { 
  Home, 
  CreditCard, 
  Wallet, 
  Scale, 
  BarChart3 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Accueil', icon: Home },
    { id: 'expenses' as ActiveTab, label: 'Dépenses', icon: CreditCard },
    { id: 'income' as ActiveTab, label: 'Revenus', icon: Wallet },
    { id: 'debts' as ActiveTab, label: 'Dettes', icon: Scale },
    { id: 'analytics' as ActiveTab, label: 'Analyse', icon: BarChart3 },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-40 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 shadow-2xl flex justify-around items-center"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-lg shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 scale-110' : ''} transition-transform`} />
            <span className="text-[10px] tracking-tight mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
