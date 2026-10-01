import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Bell,
  Search,
  Sparkles,
  X,
  LogOut,
  Trash2,
  Mail
} from 'lucide-react';
import { DeviceMode, Currency, Transaction, DebtItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  transactions: Transaction[];
  debts: DebtItem[];
  user: { id: string; email: string };
  onLogout: () => void;
  onResetData: () => void;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  tone: 'warning' | 'success';
}

export const Header: React.FC<HeaderProps> = ({
  deviceMode,
  setDeviceMode,
  currency,
  setCurrency,
  searchTerm,
  setSearchTerm,
  transactions,
  debts,
  user,
  onLogout,
  onResetData,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications entièrement dérivées des vraies données de l'utilisateur —
  // aucune valeur fictive. Une base vide produit donc une liste vide.
  const notifications: AppNotification[] = [];

  debts
    .filter((d) => d.status === 'overdue' && d.remainingAmount > 0)
    .forEach((d) => {
      notifications.push({
        id: `debt-${d.id}`,
        title: d.type === 'receivable' ? 'Créance en retard' : 'Dette en retard',
        message: `${d.personOrCompany} a dépassé la date d'échéance de ${formatCurrency(d.remainingAmount, currency)}.`,
        tone: 'warning',
      });
    });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0) {
    const expenseRatio = Math.round((totalExpenses / totalIncome) * 100);
    notifications.push({
      id: 'monthly-digest',
      title: 'Point Financier du Mois',
      message: `Vos dépenses représentent ${expenseRatio}% de vos revenus ce mois-ci.`,
      tone: expenseRatio <= 50 ? 'success' : 'warning',
    });
  }

  const unreadNotificationsCount = notifications.length;
  const avatarInitials = user.email.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="min-h-16 md:min-h-20 pt-[env(safe-area-inset-top)] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 z-30 sticky top-0 w-full transition-all">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
            <span className="font-bold text-xl text-white tracking-wider">F</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">FinanceFlow</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                iOS & Android
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Gestion financière personnelle</p>
          </div>
        </div>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une dépense, revenu, contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 placeholder:text-slate-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Actions & Device Mode Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white/10 transition-all"
            >
              <option value="FCFA" className="bg-slate-900 text-slate-100">FCFA (XAF/XOF)</option>
              <option value="EUR (€)" className="bg-slate-900 text-slate-100">EUR (€)</option>
              <option value="USD ($)" className="bg-slate-900 text-slate-100">USD ($)</option>
              <option value="CAD ($)" className="bg-slate-900 text-slate-100">CAD ($)</option>
              <option value="GBP (£)" className="bg-slate-900 text-slate-100">GBP (£)</option>
            </select>
          </div>

          {/* Device Simulator Frame Mode Toggle */}
          <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
            <button
              onClick={() => setDeviceMode('fullscreen')}
              title="Vue Écran Large"
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'fullscreen'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Large
            </button>
            <button
              onClick={() => setDeviceMode('iphone')}
              title="Simulateur iPhone"
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'iphone'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              iPhone
            </button>
            <button
              onClick={() => setDeviceMode('android')}
              title="Simulateur Android"
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'android'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android
            </button>
          </div>

          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1 rounded-full border border-white/20 hover:border-indigo-400 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {avatarInitials}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Notifications Popover */}
      {showNotifications && (
        <div className="fixed top-20 right-4 sm:right-8 w-80 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" /> Notifications
            </h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Fermer
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {notifications.length === 0 ? (
              <p className="text-slate-500 text-center py-6">Aucune notification pour le moment.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="font-medium text-slate-200">{n.title}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      n.tone === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {n.tone === 'warning' ? 'Rappel de paiement recommandé' : 'Excellente gestion !'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Profil Utilisateur</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-lg font-bold text-indigo-300">
                  {avatarInitials}
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-sm truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </h4>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                  Compte synchronisé
                </span>
              </div>
            </div>
            <div className="space-y-2 text-xs pt-2 border-t border-white/10">
              <div className="flex justify-between py-1.5 text-slate-300">
                <span>Devise Principale</span>
                <span className="font-semibold text-indigo-300">{currency}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-300">
                <span>Compatibilité Mobile</span>
                <span className="font-semibold text-cyan-300">iOS & Android Web App</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onLogout();
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Se déconnecter
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onResetData();
                }}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Effacer toutes mes données
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
