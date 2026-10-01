import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Trash2, 
  Calendar,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  HelpCircle,
  TrendingDown,
  Tag,
  Pencil
} from 'lucide-react';
import { Transaction, ExpenseCategory, Currency } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExpensesViewProps {
  transactions: Transaction[];
  currency: Currency;
  onOpenExpenseModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (tx: Transaction) => void;
}

const CATEGORY_ICONS: Record<ExpenseCategory, React.ElementType> = {
  'Alimentation & Restaurants': Utensils,
  'Transport': Car,
  'Logement & Loyer': Home,
  'Factures & Services': Zap,
  'Shopping & Achats': ShoppingBag,
  'Loisirs & Divertissement': Film,
  'Santé & Soins': HeartPulse,
  'Éducation': GraduationCap,
  'Autre': HelpCircle,
};

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  transactions,
  currency,
  onOpenExpenseModal,
  onDeleteTransaction,
  onEditTransaction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const expenses = transactions.filter((t) => t.type === 'expense');

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for visual breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryList: ExpenseCategory[] = [
    'Alimentation & Restaurants',
    'Transport',
    'Logement & Loyer',
    'Factures & Services',
    'Shopping & Achats',
    'Loisirs & Divertissement',
    'Santé & Soins',
    'Éducation',
    'Autre',
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = selectedCategory === 'Toutes' || e.category === selectedCategory;
    const matchesQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-rose-400" /> Dépenses
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Suivez et optimisez vos sorties d'argent au quotidien
          </p>
        </div>

        <button
          onClick={onOpenExpenseModal}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Nouvelle Dépense
        </button>
      </div>

      {/* Expense Summary Header Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">
              Total Dépenses Enregistrées
            </p>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight">
              - {formatCurrency(totalExpenseAmount, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {expenses.length} transaction{expenses.length > 1 ? 's' : ''} répertoriée{expenses.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Top Category Badge */}
          {Object.keys(categoryTotals).length > 0 && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Poste Principal</p>
                <p className="text-xs font-bold text-white">
                  {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown Bar */}
        {totalExpenseAmount > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Répartition par Catégorie</span>
              <span>100%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
              {Object.entries(categoryTotals).map(([cat, amount], idx) => {
                const percent = Math.round((amount / totalExpenseAmount) * 100);
                const colors = [
                  'bg-rose-500',
                  'bg-indigo-500',
                  'bg-cyan-500',
                  'bg-amber-500',
                  'bg-emerald-500',
                  'bg-purple-500',
                ];
                return (
                  <div
                    key={cat}
                    style={{ width: `${percent}%` }}
                    className={`${colors[idx % colors.length]} h-full`}
                    title={`${cat}: ${percent}%`}
                  ></div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une dépense..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-slate-500"
          />
        </div>

        {/* Horizontal Category Scroll */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Toutes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'Toutes'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            Toutes
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Aucune dépense enregistrée</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Saisissez vos dépenses quotidiennes pour conserver un contrôle rigoureux de votre budget.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => {
              const IconComponent = CATEGORY_ICONS[expense.category as ExpenseCategory] || CreditCard;

              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {expense.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-[10px] font-medium border border-rose-500/20">
                          {expense.category}
                        </span>
                        <span>•</span>
                        <span>{expense.paymentMode}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-bold text-rose-400">
                        - {formatCurrency(expense.amount, currency)}
                      </p>
                      {expense.description && (
                        <p className="text-[10px] text-slate-400 italic hidden sm:block">
                          {expense.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onEditTransaction(expense)}
                      className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(expense.id)}
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
