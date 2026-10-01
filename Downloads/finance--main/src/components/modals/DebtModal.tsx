import React, { useEffect, useState } from 'react';
import { X, Scale } from 'lucide-react';
import { DebtItem, DebtType, Currency } from '../../types';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debt: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) => void;
  onUpdate?: (id: string, debt: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) => void;
  editingDebt?: DebtItem | null;
  currency: Currency;
}

export const DebtModal: React.FC<DebtModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingDebt,
  currency,
}) => {
  const isEditing = !!editingDebt;

  const [type, setType] = useState<DebtType>('receivable');
  const [personOrCompany, setPersonOrCompany] = useState('');
  const [description, setDescription] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Pré-remplit le formulaire quand on ouvre la modale en mode édition.
  useEffect(() => {
    if (isOpen && editingDebt) {
      setType(editingDebt.type);
      setPersonOrCompany(editingDebt.personOrCompany);
      setDescription(editingDebt.description);
      setInitialAmount(String(editingDebt.initialAmount));
      setDueDate(editingDebt.dueDate || '');
    } else if (isOpen && !editingDebt) {
      setType('receivable');
      setPersonOrCompany('');
      setDescription('');
      setInitialAmount('');
      setDueDate('');
    }
  }, [isOpen, editingDebt]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(initialAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !personOrCompany.trim()) return;

    const payload: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'> = {
      personOrCompany: personOrCompany.trim(),
      type,
      description: description.trim() || (type === 'receivable' ? 'Prêt accordé' : 'Emprunt à rembourser'),
      initialAmount: amountNum,
      remainingAmount: amountNum,
      dueDate: dueDate || undefined,
      status: 'active',
    };

    if (isEditing && onUpdate && editingDebt) {
      onUpdate(editingDebt.id, payload);
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Modifier la Fiche' : 'Nouvelle Fiche Dette / Créance'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Mettez à jour les détails de cette dette ou créance' : 'Suivez un prêt ou un emprunt avec un tiers'}
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
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setType('receivable')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'receivable'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              À Recevoir (Créance)
            </button>
            <button
              type="button"
              onClick={() => setType('payable')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'payable'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              À Payer (Dette)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nom de la Personne / Organisme *
            </label>
            <input
              type="text"
              required
              placeholder="ex. Jean Dupont, TechCorp, Banque..."
              value={personOrCompany}
              onChange={(e) => setPersonOrCompany(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Montant Initial ({currency}) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Date d'Échéance (Optionnel)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Motif / Objet</label>
            <input
              type="text"
              placeholder="ex. Prêt pour achat matériel, Avance sur salaire..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
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
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
            >
              {isEditing ? 'Enregistrer les Modifications' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
