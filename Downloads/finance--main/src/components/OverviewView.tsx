import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowUpLeft, 
  Plus, 
  Minus, 
  Filter, 
  Search, 
  Receipt,
  Calendar,
  Trash2,
  Pencil,
  CreditCard,
  Building,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Transaction, DebtItem, Currency } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface OverviewViewProps {
  transactions: Transaction[];
  debts: DebtItem[];
  currency: Currency;
  searchTerm: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenDebtModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  onNavigateTab: (tab: 'expenses' | 'income' | 'debts' | 'analytics') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  transactions,
  debts,
  currency,
  searchTerm,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenDebtModal,
  onDeleteTransaction,
  onEditTransaction,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Calculated Metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceivables = debts
    .filter((d) => d.type === 'receivable')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalPayables = debts
    .filter((d) => d.type === 'payable')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Hero Total Balance Card */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl">
        {/* Background Glowing Orbs */}
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-64 h-64 bg-cyan-600/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                Solde Net Disponible
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Mis à jour en direct
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight my-2">
              {formatCurrency(netBalance, currency)}
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
              <span className="text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +
                {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 100}%
              </span>
              taux de rétention ce mois-ci
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenIncomeModal}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> + Revenu
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Minus className="w-4 h-4" /> + Dépense
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Secondary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Income Card */}
        <div 
          onClick={() => onNavigateTab('income')}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Revenus Totaux</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalIncome, currency)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <span>Voir détail</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Expenses Card */}
        <div 
          onClick={() => onNavigateTab('expenses')}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-rose-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Dépenses Totales</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalExpenses, currency)}
          </div>
          <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1 font-medium">
            <span>Voir détail</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* To Receive Card (Créances) */}
        <div 
          onClick={() => onNavigateTab('debts')}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">À Recevoir (Créances)</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalReceivables, currency)}
          </div>
          <p className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1 font-medium">
            <span>Dettes dues par des tiers</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* To Pay Card (Dettes) */}
        <div 
          onClick={() => onNavigateTab('debts')}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">À Payer (Dettes)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ArrowUpLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {formatCurrency(totalPayables, currency)}
          </div>
          <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1 font-medium">
            <span>Remboursements à prévoir</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </section>

      {/* Recent Operations Table / List */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" /> Dernières Opérations
            </h2>
            <p className="text-xs text-slate-400">Historique complet de vos entrées et sorties d'argent</p>
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Revenus
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Dépenses
            </button>
          </div>
        </div>

        {/* List Content */}
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
              <Receipt className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Aucune opération trouvée</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Ajoutez votre première dépense ou votre premier revenu à l'aide des boutons ci-dessus.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Category Avatar */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md ${
                        isIncome
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {tx.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-medium">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{tx.paymentMode}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formatDate(tx.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`text-sm sm:text-base font-bold ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </p>
                      {tx.comment && (
                        <p className="text-[10px] text-slate-400 italic hidden sm:block">
                          {tx.comment}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
