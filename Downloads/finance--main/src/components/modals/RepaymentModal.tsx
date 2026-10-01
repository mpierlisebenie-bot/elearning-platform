import React, { useState } from 'react';
import { X, Undo2 } from 'lucide-react';
import { DebtItem, PaymentMode, Repayment, Currency } from '../../types';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: DebtItem | null;
  onSaveRepayment: (debtId: string, repayment: Omit<Repayment, 'id'>) => void;
  currency: Currency;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  isOpen,
  onClose,
  debt,
  onSaveRepayment,
  currency,
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Mobile Money');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isOpen || !debt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSaveRepayment(debt.id, {
      amount: numAmount,
      date,
      paymentMode,
      note: note.trim() || undefined,
    });

    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Undo2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nouveau Versement</h3>
              <p className="text-xs text-slate-400">Pour {debt.personOrCompany}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-xs space-y-1">
            <p className="text-slate-400">Solde Restant Actuel:</p>
            <p className="text-xl font-bold text-cyan-300">
              {debt.remainingAmount} {currency}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Montant du Versement ({currency}) *
            </label>
            <input
              type="number"
              step="any"
              max={debt.remainingAmount}
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mode de Paiement *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Virement Bancaire">Virement Bancaire</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Note (Optionnel)</label>
            <input
              type="text"
              placeholder="ex. Acompte tranche n°2..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
            >
              Enregistrer le Versement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
