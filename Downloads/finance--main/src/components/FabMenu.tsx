import React, { useState } from 'react';
import { Plus, MinusCircle, PlusCircle, CreditCard, Undo2, X } from 'lucide-react';

interface FabMenuProps {
  onOpenNewExpense: () => void;
  onOpenNewIncome: () => void;
  onOpenNewDebt: () => void;
  onOpenNewRepayment: () => void;
}

export const FabMenu: React.FC<FabMenuProps> = ({
  onOpenNewExpense,
  onOpenNewIncome,
  onOpenNewDebt,
  onOpenNewRepayment,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed right-5 z-40 flex flex-col items-end bottom-[max(5rem,calc(4.5rem+env(safe-area-inset-bottom)))] md:bottom-8">
      {/* Popover Actions Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => handleAction(onOpenNewExpense)}
            className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl hover:bg-slate-800/90 text-slate-100 transition-all active:scale-95 group"
          >
            <span className="text-xs font-semibold group-hover:text-rose-300">Nouvelle Dépense</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <MinusCircle className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(onOpenNewIncome)}
            className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl hover:bg-slate-800/90 text-slate-100 transition-all active:scale-95 group"
          >
            <span className="text-xs font-semibold group-hover:text-emerald-300">Nouveau Revenu</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(onOpenNewDebt)}
            className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl hover:bg-slate-800/90 text-slate-100 transition-all active:scale-95 group"
          >
            <span className="text-xs font-semibold group-hover:text-amber-300">Nouvelle Dette / Créance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleAction(onOpenNewRepayment)}
            className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl shadow-xl hover:bg-slate-800/90 text-slate-100 transition-all active:scale-95 group"
          >
            <span className="text-xs font-semibold group-hover:text-cyan-300">Nouveau Remboursement</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Undo2 className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Primary Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-95 border border-white/20 transition-all duration-300 ${
          isOpen ? 'rotate-45 from-rose-500 to-amber-500 shadow-rose-500/30' : ''
        }`}
        title="Ajouter une opération"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};
