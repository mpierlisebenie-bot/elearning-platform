import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Gift,
  Building,
  HelpCircle,
  Pencil
} from 'lucide-react';
import { Transaction, IncomeCategory, Currency } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface IncomeViewProps {
  transactions: Transaction[];
  currency: Currency;
  onOpenIncomeModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: Transaction) => void;
}

const INCOME_ICONS: Record<IncomeCategory, React.ElementType> = {
  'Salaire': Briefcase,
  'Freelance': DollarSign,
  'Investissements': TrendingUp,
  'Ventes & Commerce': Building,
  'Cadeau & Prime': Gift,
  'Remboursement Reçu': Award,
  'Autre': HelpCircle,
};

export const IncomeView: React.FC<IncomeViewProps> = ({
  transactions,
  currency,
  onOpenIncomeModal,
  onDeleteTransaction,
  onEditTransaction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const incomes = transactions.filter((t) => t.type === 'income');

  const totalIncomeAmount = incomes.reduce((sum, i) => sum + i.amount, 0);

  const categoryTotals: Record<string, number> = {};
  incomes.forEach((i) => {
    categoryTotals[i.category] = (categoryTotals[i.category] || 0) + i.amount;
  });

  const incomeCategories: IncomeCategory[] = [
    'Salaire',
    'Freelance',
    'Investissements',
    'Ventes & Commerce',
    'Cadeau & Prime',
    'Remboursement Reçu',
    'Autre',
  ];

  const filteredIncomes = incomes.filter((i) => {
    const matchesCat = selectedCategory === 'Toutes' || i.category === selectedCategory;
    const matchesQuery =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.description && i.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-emerald-400" /> Sources de Revenus
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Gérez vos salaires, missions et retours d'investissement
          </p>
        </div>

        <button
          onClick={onOpenIncomeModal}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Nouveau Revenu
        </button>
      </div>

      {/* Income Total Summary Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Revenus Totaux Cumulés
            </p>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
              + {formatCurrency(totalIncomeAmount, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {incomes.length} source{incomes.length > 1 ? 's' : ''} de revenu enregistrée{incomes.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Top Source Badge */}
          {Object.keys(categoryTotals).length > 0 && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Source Principale</p>
                <p className="text-xs font-bold text-white">
                  {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un revenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-500"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'Toutes'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            Toutes
          </button>
          {incomeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Income List */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        {filteredIncomes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
              <Wallet className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Aucun revenu enregistré</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Ajoutez vos sources d'entrées d'argent pour suivre la progression de votre patrimoine.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncomes.map((income) => {
              const IconComponent = INCOME_ICONS[income.category as IncomeCategory] || Wallet;

              return (
                <div
                  key={income.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {income.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-medium border border-emerald-500/20">
                          {income.category}
                        </span>
                        <span>•</span>
                        <span>{income.paymentMode}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formatDate(income.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-bold text-emerald-400">
                        + {formatCurrency(income.amount, currency)}
                      </p>
                      {income.description && (
                        <p className="text-[10px] text-slate-400 italic hidden sm:block">
                          {income.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onEditTransaction(income)}
                      className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(income.id)}
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
      </div>
    </div>
  );
};
