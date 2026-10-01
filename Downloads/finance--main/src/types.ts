export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Alimentation & Restaurants'
  | 'Transport'
  | 'Logement & Loyer'
  | 'Factures & Services'
  | 'Shopping & Achats'
  | 'Loisirs & Divertissement'
  | 'Santé & Soins'
  | 'Éducation'
  | 'Autre';

export type IncomeCategory =
  | 'Salaire'
  | 'Freelance'
  | 'Investissements'
  | 'Ventes & Commerce'
  | 'Cadeau & Prime'
  | 'Remboursement Reçu'
  | 'Autre';

export type PaymentMode = 'Mobile Money' | 'Espèces' | 'Virement Bancaire' | 'Carte Bancaire';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  paymentMode: PaymentMode;
  date: string; // YYYY-MM-DD
  description?: string;
  comment?: string;
  createdAt: string;
}

export type DebtType = 'receivable' | 'payable'; // receivable = À percevoir (créance), payable = À payer (dette)

export interface Repayment {
  id: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  note?: string;
}

export interface DebtItem {
  id: string;
  personOrCompany: string;
  type: DebtType;
  description: string;
  initialAmount: number;
  remainingAmount: number;
  dueDate?: string;
  status: 'active' | 'overdue' | 'paid';
  repayments: Repayment[];
  createdAt: string;
}

export type Currency = 'FCFA' | 'EUR (€)' | 'USD ($)' | 'CAD ($)' | 'GBP (£)';

export type ActiveTab = 'home' | 'expenses' | 'income' | 'debts' | 'analytics';

export type DeviceMode = 'fullscreen' | 'iphone' | 'android';
