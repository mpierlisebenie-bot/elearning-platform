import React, { useEffect, useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { IncomeCategory, PaymentMode, Transaction, Currency } from '../../types';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, income: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  currency: Currency;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingTransaction,
  currency,
}) => {
  const isEditing = !!editingTransaction;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('Salaire');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Virement Bancaire');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(String(editingTransaction.amount));
      setCategory(editingTransaction.category as IncomeCategory);
      setPaymentMode(editingTransaction.paymentMode);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
    } else if (isOpen && !editingTransaction) {
      setTitle('');
      setAmount('');
      setCategory('Salaire');
      setPaymentMode('Virement Bancaire');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [isOpen, editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !title.trim()) return;

    const payload: Omit<Transaction, 'id' | 'createdAt'> = {
      type: 'income',
      title: title.trim(),
      amount: numAmount,
      category,
      paymentMode,
      date,
      description: description.trim() || undefined,
    };

    if (isEditing && onUpdate && editingTransaction) {
      onUpdate(editingTransaction.id, payload);
    } else {
      onSave(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Modifier le Revenu' : 'Nouveau Revenu'}</h3>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Mettez à jour les détails de ce revenu' : "Ajoutez une entrée d'argent"}
              </p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source / Intitulé *</label>
            <input
              type="text"
              required
              placeholder="ex. Salaire mensuel, Mission Freelance..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Montant ({currency}) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Salaire">Salaire</option>
                <option value="Freelance">Freelance</option>
                <option value="Investissements">Investissements</option>
                <option value="Ventes & Commerce">Ventes & Commerce</option>
                <option value="Cadeau & Prime">Cadeau & Prime</option>
                <option value="Remboursement Reçu">Remboursement Reçu</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mode de Paiement *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Virement Bancaire">Virement Bancaire</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optionnel)</label>
            <input
              type="text"
              placeholder="Note ou détails..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-500"
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
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              {isEditing ? 'Enregistrer les Modifications' : 'Enregistrer le Revenu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
