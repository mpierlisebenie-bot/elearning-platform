import { Currency } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'FCFA'): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);

  switch (currency) {
    case 'FCFA':
      return `${formatted} FCFA`;
    case 'EUR (€)':
      return `${formatted} €`;
    case 'USD ($)':
      return `$${formatted}`;
    case 'CAD ($)':
      return `CA$${formatted}`;
    case 'GBP (£)':
      return `£${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  }).format(date);
}
