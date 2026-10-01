import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FabMenu } from './components/FabMenu';
import { OverviewView } from './components/OverviewView';
import { ExpensesView } from './components/ExpensesView';
import { IncomeView } from './components/IncomeView';
import { DebtsView } from './components/DebtsView';
import { AnalyticsView } from './components/AnalyticsView';
import { DeviceSimulatorFrame } from './components/DeviceSimulatorFrame';
import { AuthScreen } from './components/AuthScreen';

import { ExpenseModal } from './components/modals/ExpenseModal';
import { IncomeModal } from './components/modals/IncomeModal';
import { DebtModal } from './components/modals/DebtModal';
import { RepaymentModal } from './components/modals/RepaymentModal';

import { api, getToken, setToken, ApiError } from './api/client';
import {
  Transaction,
  DebtItem,
  ActiveTab,
  DeviceMode,
  Currency,
  Repayment,
} from './types';
import { Shield, Loader2, WifiOff, X } from 'lucide-react';

type AuthUser = { id: string; email: string };

export default function App() {
  // --- Authentification ---------------------------------------------------
  // `authChecked` évite un flash de l'écran de connexion pendant qu'on
  // vérifie un jeton déjà présent (utilisateur qui revient sur l'app).
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // --- Données (chargées depuis le serveur, jamais depuis localStorage) --
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fullscreen');
  const [currency, setCurrency] = useState<Currency>('FCFA');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [selectedDebtForRepaymentId, setSelectedDebtForRepaymentId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);

  // Vérifie une éventuelle session existante au chargement de l'app, et
  // nettoie les anciennes clés localStorage d'une version antérieure de
  // l'app (avant l'introduction du compte serveur) — elles ne sont plus
  // utilisées et pourraient sinon induire en erreur.
  useEffect(() => {
    localStorage.removeItem('ff_transactions');
    localStorage.removeItem('ff_debts');

    const token = getToken();
    if (!token) {
      setAuthChecked(true);
      return;
    }
    api
      .me()
      .then(({ user }) => setCurrentUser(user))
      .catch(() => setToken(null))
      .finally(() => setAuthChecked(true));
  }, []);

  const loadData = useCallback(() => {
    setDataLoading(true);
    setErrorMessage(null);
    Promise.all([api.listTransactions(), api.listDebts()])
      .then(([txs, ds]) => {
        setTransactions(txs);
        setDebts(ds);
      })
      .catch((e) => {
        setErrorMessage(e instanceof ApiError ? e.message : 'Impossible de joindre le serveur. Vérifiez votre connexion.');
      })
      .finally(() => setDataLoading(false));
  }, []);

  // Charge les données dès qu'un utilisateur est authentifié.
  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser, loadData]);

  const handleAuthenticated = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setTransactions([]);
    setDebts([]);
    setActiveTab('home');
  };

  // Petit utilitaire pour uniformiser la gestion d'erreur réseau/API sur
  // chaque action (ajout, modification, suppression...).
  const runAction = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (e) {
      setErrorMessage(e instanceof ApiError ? e.message : "Action impossible : vérifiez votre connexion et réessayez.");
    }
  };

  // --- Handlers Transactions -----------------------------------------------
  const handleAddExpense = (data: Omit<Transaction, 'id' | 'createdAt'>) =>
    runAction(async () => {
      const created = await api.createTransaction(data);
      setTransactions((prev) => [created, ...prev]);
    });

  const handleAddIncome = (data: Omit<Transaction, 'id' | 'createdAt'>) =>
    runAction(async () => {
      const created = await api.createTransaction(data);
      setTransactions((prev) => [created, ...prev]);
    });

  const handleUpdateTransaction = (id: string, data: Omit<Transaction, 'id' | 'createdAt'>) =>
    runAction(async () => {
      const updated = await api.updateTransaction(id, data);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    });

  const handleDeleteTransaction = (id: string) =>
    runAction(async () => {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    });

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    if (tx.type === 'expense') setIsExpenseModalOpen(true);
    else setIsIncomeModalOpen(true);
  };

  // --- Handlers Dettes -------------------------------------------------------
  const handleAddDebt = (data: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) =>
    runAction(async () => {
      const created = await api.createDebt(data);
      setDebts((prev) => [created, ...prev]);
    });

  const handleUpdateDebt = (id: string, data: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) =>
    runAction(async () => {
      const updated = await api.updateDebt(id, data);
      setDebts((prev) => prev.map((d) => (d.id === id ? updated : d)));
    });

  const handleDeleteDebt = (debtId: string) =>
    runAction(async () => {
      await api.deleteDebt(debtId);
      setDebts((prev) => prev.filter((d) => d.id !== debtId));
    });

  const handleEditDebt = (debt: DebtItem) => {
    setEditingDebt(debt);
    setIsDebtModalOpen(true);
  };

  const handleAddRepayment = (debtId: string, repaymentData: Omit<Repayment, 'id'>) =>
    runAction(async () => {
      const { debt, transaction } = await api.addRepayment(debtId, repaymentData);
      setDebts((prev) => prev.map((d) => (d.id === debtId ? debt : d)));
      setTransactions((prev) => [transaction, ...prev]);
    });

  const handleResetData = () => {
    if (window.confirm('Voulez-vous supprimer définitivement toutes vos données (transactions et dettes) ?')) {
      runAction(async () => {
        await api.wipeAllData();
        setTransactions([]);
        setDebts([]);
      });
    }
  };

  const debtForRepayment = debts.find((d) => d.id === selectedDebtForRepaymentId) || null;

  // --- États de chargement / non-authentifié --------------------------------
  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#070c18]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <DeviceSimulatorFrame deviceMode={deviceMode}>
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Navigation Top Header */}
        <Header
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          currency={currency}
          setCurrency={setCurrency}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          transactions={transactions}
          debts={debts}
          user={currentUser}
          onLogout={handleLogout}
          onResetData={handleResetData}
        />

        {/* Bandeau d'erreur réseau/API, non bloquant */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 md:mx-8 mt-4 relative z-10">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs max-w-7xl mx-auto">
              <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1">{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content View Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-24 md:pb-20 relative z-10">
          {dataLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <OverviewView
                  transactions={transactions}
                  debts={debts}
                  currency={currency}
                  searchTerm={searchTerm}
                  onOpenExpenseModal={() => { setEditingTransaction(null); setIsExpenseModalOpen(true); }}
                  onOpenIncomeModal={() => { setEditingTransaction(null); setIsIncomeModalOpen(true); }}
                  onOpenDebtModal={() => setIsDebtModalOpen(true)}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'expenses' && (
                <ExpensesView
                  transactions={transactions}
                  currency={currency}
                  onOpenExpenseModal={() => { setEditingTransaction(null); setIsExpenseModalOpen(true); }}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              )}

              {activeTab === 'income' && (
                <IncomeView
                  transactions={transactions}
                  currency={currency}
                  onOpenIncomeModal={() => { setEditingTransaction(null); setIsIncomeModalOpen(true); }}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              )}

              {activeTab === 'debts' && (
                <DebtsView
                  debts={debts}
                  currency={currency}
                  onOpenDebtModal={() => { setEditingDebt(null); setIsDebtModalOpen(true); }}
                  onOpenRepaymentModal={(id) => setSelectedDebtForRepaymentId(id)}
                  onDeleteDebt={handleDeleteDebt}
                  onEditDebt={handleEditDebt}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView transactions={transactions} debts={debts} currency={currency} />
              )}
            </>
          )}
        </main>

        {/* Floating Action Button */}
        <FabMenu
          onOpenNewExpense={() => { setEditingTransaction(null); setIsExpenseModalOpen(true); }}
          onOpenNewIncome={() => { setEditingTransaction(null); setIsIncomeModalOpen(true); }}
          onOpenNewDebt={() => { setEditingDebt(null); setIsDebtModalOpen(true); }}
          onOpenNewRepayment={() => {
            if (debts.length > 0) {
              setSelectedDebtForRepaymentId(debts[0].id);
            } else {
              setEditingDebt(null);
              setIsDebtModalOpen(true);
            }
          }}
        />

        {/* Bottom Responsive Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Modals */}
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => { setIsExpenseModalOpen(false); setEditingTransaction(null); }}
          onSave={handleAddExpense}
          onUpdate={handleUpdateTransaction}
          editingTransaction={editingTransaction && editingTransaction.type === 'expense' ? editingTransaction : null}
          currency={currency}
        />

        <IncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => { setIsIncomeModalOpen(false); setEditingTransaction(null); }}
          onSave={handleAddIncome}
          onUpdate={handleUpdateTransaction}
          editingTransaction={editingTransaction && editingTransaction.type === 'income' ? editingTransaction : null}
          currency={currency}
        />

        <DebtModal
          isOpen={isDebtModalOpen}
          onClose={() => { setIsDebtModalOpen(false); setEditingDebt(null); }}
          onSave={handleAddDebt}
          onUpdate={handleUpdateDebt}
          editingDebt={editingDebt}
          currency={currency}
        />

        <RepaymentModal
          isOpen={!!selectedDebtForRepaymentId}
          onClose={() => setSelectedDebtForRepaymentId(null)}
          debt={debtForRepayment}
          onSaveRepayment={handleAddRepayment}
          currency={currency}
        />

        {/* Footer (Desktop / Fullscreen) */}
        {deviceMode === 'fullscreen' && (
          <footer className="hidden sm:flex h-12 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 items-center justify-between text-[11px] text-slate-400 z-10 flex-wrap gap-2">
            <p>© 2026 FinanceFlow Systems • Optimisé pour iOS & Android</p>
            <p className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Compte Sécurisé • {currentUser.email}
            </p>
          </footer>
        )}
      </div>
    </DeviceSimulatorFrame>
  );
}
