import React, { useEffect, useState } from 'react';
import { X, MinusCircle } from 'lucide-react';
import { ExpenseCategory, PaymentMode, Transaction, Currency } from '../../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, expense: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  currency: Currency;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
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
  const [category, setCategory] = useState<ExpenseCategory>('Alimentation & Restaurants');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Mobile Money');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  // Pré-remplit le formulaire quand on ouvre la modale en mode édition.
  useEffect(() => {
    if (isOpen && editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(String(editingTransaction.amount));
      setCategory(editingTransaction.category as ExpenseCategory);
      setPaymentMode(editingTransaction.paymentMode);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
      setComment(editingTransaction.comment || '');
    } else if (isOpen && !editingTransaction) {
      setTitle('');
      setAmount('');
      setCategory('Alimentation & Restaurants');
      setPaymentMode('Mobile Money');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setComment('');
    }
  }, [isOpen, editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !title.trim()) return;

    const payload: Omit<Transaction, 'id' | 'createdAt'> = {
      type: 'expense',
      title: title.trim(),
      amount: numAmount,
      category,
      paymentMode,
      date,
      description: description.trim() || undefined,
      comment: comment.trim() || undefined,
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
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <MinusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Modifier la Dépense' : 'Nouvelle Dépense'}</h3>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Mettez à jour les détails de cette dépense' : 'Saisissez les détails de votre dépense'}
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Libellé de la Dépense *
            </label>
            <input
              type="text"
              required
              placeholder="ex. Dîner au restaurant, Achats supermarché..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-slate-500"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                <option value="Alimentation & Restaurants">Alimentation & Restaurants</option>
                <option value="Transport">Transport</option>
                <option value="Logement & Loyer">Logement & Loyer</option>
                <option value="Factures & Services">Factures & Services</option>
                <option value="Shopping & Achats">Shopping & Achats</option>
                <option value="Loisirs & Divertissement">Loisirs & Divertissement</option>
                <option value="Santé & Soins">Santé & Soins</option>
                <option value="Éducation">Éducation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mode de Paiement *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Espèces">Espèces</option>
                <option value="Virement Bancaire">Virement Bancaire</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optionnel)</label>
            <input
              type="text"
              placeholder="Courte description supplémentaire..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Note / Commentaire</label>
            <textarea
              rows={2}
              placeholder="Commentaires éventuels..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder:text-slate-500"
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
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition-all"
            >
              {isEditing ? 'Enregistrer les Modifications' : 'Enregistrer la Dépense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
