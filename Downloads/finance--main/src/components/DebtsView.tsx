import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  User, 
  Building, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  ArrowRight,
  Eye,
  Trash2,
  Pencil,
  Undo2,
  X
} from 'lucide-react';
import { DebtItem, DebtType, Currency, Repayment } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DebtsViewProps {
  debts: DebtItem[];
  currency: Currency;
  onOpenDebtModal: () => void;
  onOpenRepaymentModal: (debtId: string) => void;
  onDeleteDebt: (debtId: string) => void;
  onEditDebt: (debt: DebtItem) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  currency,
  onOpenDebtModal,
  onOpenRepaymentModal,
  onDeleteDebt,
  onEditDebt,
}) => {
  const [activeTab, setActiveTab] = useState<DebtType>('receivable');
  const [selectedDebtForDetail, setSelectedDebtForDetail] = useState<DebtItem | null>(null);

  const filteredDebts = debts.filter((d) => d.type === activeTab);

  const totalReceivables = debts
    .filter((d) => d.type === 'receivable')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalPayables = debts
    .filter((d) => d.type === 'payable')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-7 h-7 text-indigo-400" /> Dettes & Créances
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Suivez ce qui vous est dû et ce que vous devez rembourser
          </p>
        </div>

        <button
          onClick={onOpenDebtModal}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Nouvelle Dette / Créance
        </button>
      </div>

      {/* Tabs Selector Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex gap-2">
        <button
          onClick={() => setActiveTab('receivable')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'receivable'
              ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>À Recevoir (Créances)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300">
            {formatCurrency(totalReceivables, currency)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payable')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'payable'
              ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>À Payer (Dettes)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
            {formatCurrency(totalPayables, currency)}
          </span>
        </button>
      </div>

      {/* Grid of Debt Cards */}
      {filteredDebts.length === 0 ? (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-dashed border-white/15 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Tout est à jour</h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            {activeTab === 'receivable'
              ? "Personne ne vous doit d'argent pour le moment."
              : "Vous n'avez actuellement aucune dette enregistrée. Profitez de cette tranquillité !"}
          </p>
          <button
            onClick={onOpenDebtModal}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            + Enregistrer une nouvelle fiche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDebts.map((debt) => {
            const paidAmount = debt.initialAmount - debt.remainingAmount;
            const progressPercent = Math.min(
              100,
              Math.round((paidAmount / debt.initialAmount) * 100)
            );

            const isOverdue = debt.status === 'overdue';
            const isPaid = debt.status === 'paid' || debt.remainingAmount <= 0;

            return (
              <div
                key={debt.id}
                onClick={() => setSelectedDebtForDetail(debt)}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-6 shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {debt.personOrCompany}
                        </h3>
                        <p className="text-[11px] text-slate-400">{debt.description}</p>
                      </div>
                    </div>

                    {/* Status Badge + Actions rapides */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                          isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isOverdue
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {isPaid ? 'Soldé' : isOverdue ? 'En retard' : 'Actif'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDebt(debt);
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDebt(debt.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remaining Amount Display */}
                  <div className="my-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Solde Restant
                    </p>
                    <div
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        activeTab === 'receivable' ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {formatCurrency(debt.remainingAmount, currency)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Progression du remboursement</span>
                      <span className="font-bold text-white">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeTab === 'receivable' ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Total Initial: {formatCurrency(debt.initialAmount, currency)}</span>
                      <span>Remboursé: {formatCurrency(paidAmount, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {debt.repayments.length} versement{debt.repayments.length > 1 ? 's' : ''}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRepaymentModal(debt.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Versement
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Debt Detail Modal */}
      {selectedDebtForDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDebtForDetail.personOrCompany}</h3>
                <p className="text-xs text-slate-400">{selectedDebtForDetail.description}</p>
              </div>
              <button
                onClick={() => setSelectedDebtForDetail(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Metric Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase font-semibold">Reste à percevoir / payer</p>
                <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                  {formatCurrency(selectedDebtForDetail.remainingAmount, currency)}
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>
                      Remboursé: {formatCurrency(selectedDebtForDetail.initialAmount - selectedDebtForDetail.remainingAmount, currency)}
                    </span>
                    <span>Total: {formatCurrency(selectedDebtForDetail.initialAmount, currency)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((selectedDebtForDetail.initialAmount - selectedDebtForDetail.remainingAmount) /
                              selectedDebtForDetail.initialAmount) *
                              100
                          )
                        )}%`,
                      }}
                      className="h-full bg-cyan-400 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Repayments History Log */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" /> Historique des Versements
                </h4>

                {selectedDebtForDetail.repayments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Aucun versement effectué pour le moment.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedDebtForDetail.repayments.map((rep) => (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{rep.paymentMode}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(rep.date)} {rep.note ? `• ${rep.note}` : ''}</p>
                        </div>
                        <span className="font-bold text-emerald-400">
                          + {formatCurrency(rep.amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border-t border-white/10 flex flex-wrap justify-between items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const debt = selectedDebtForDetail;
                    setSelectedDebtForDetail(null);
                    onEditDebt(debt);
                  }}
                  className="px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs rounded-xl flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" /> Modifier
                </button>
                <button
                  onClick={() => {
                    onDeleteDebt(selectedDebtForDetail.id);
                    setSelectedDebtForDetail(null);
                  }}
                  className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs rounded-xl flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDebtForDetail(null)}
                  className="px-4 py-2 bg-white/10 text-slate-200 font-semibold text-xs rounded-xl hover:bg-white/15"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const id = selectedDebtForDetail.id;
                    setSelectedDebtForDetail(null);
                    onOpenRepaymentModal(id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg"
                >
                  Ajouter un versement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
