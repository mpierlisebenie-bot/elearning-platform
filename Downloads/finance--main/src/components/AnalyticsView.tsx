import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Lightbulb, 
  CreditCard, 
  Wallet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Transaction, Currency, DebtItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AnalyticsViewProps {
  transactions: Transaction[];
  debts: DebtItem[];
  currency: Currency;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, debts, currency }) => {
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const savings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 100;

  // Expenses grouped by Category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Expenses grouped by Payment Mode
  const paymentModeMap: Record<string, number> = {};
  transactions.forEach((t) => {
    paymentModeMap[t.paymentMode] = (paymentModeMap[t.paymentMode] || 0) + t.amount;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" /> Analyse & Rapports Financiers
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Visualisez la structure de vos finances et votre capacité d'épargne
        </p>
      </div>

      {/* Primary Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Gauge */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taux d'Épargne</span>
            <div className="text-4xl font-extrabold text-indigo-300 my-2">{savingsRate}%</div>
            <p className="text-xs text-slate-400">Pourcentage des revenus conservés après charges</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, savingsRate)}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
              ></div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-medium">
              Épargne estimée: <span className="font-bold text-white">{formatCurrency(savings, currency)}</span>
            </p>
          </div>
        </div>

        {/* Income vs Expense Ratio */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ratio Dépenses / Revenus</span>
            <div className="text-4xl font-extrabold text-rose-400 my-2">
              {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-400">Part de vos revenus consommée par vos dépenses</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-1 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Entrées:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(totalIncome, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sorties:</span>
              <span className="font-bold text-rose-400">{formatCurrency(totalExpenses, currency)}</span>
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Santé Financière</span>
            <div className="text-2xl font-bold text-emerald-400 my-2 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              {savingsRate >= 50 ? 'Excellente' : savingsRate >= 20 ? 'Saine' : 'Attention Requis'}
            </div>
            <p className="text-xs text-slate-400">Score calculé d'après vos flux financiers récents</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Conseil: Gardez toujours 20% de vos revenus en fonds de sécurité.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" /> Ventilation des Dépenses par Poste
          </h2>

          {sortedCategories.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">Aucune dépense enregistrée.</p>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([cat, amount]) => {
                const percent = Math.round((amount / totalExpenses) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-200 font-medium">
                      <span>{cat}</span>
                      <span>
                        {formatCurrency(amount, currency)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Modes Distribution */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" /> Analyse des Modes de Paiement
          </h2>

          <div className="space-y-3 pt-2">
            {Object.entries(paymentModeMap).map(([mode, amount]) => (
              <div
                key={mode}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {mode.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{mode}</p>
                    <p className="text-[10px] text-slate-400">Volume total transité</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-300">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
