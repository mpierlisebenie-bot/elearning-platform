import { Transaction, DebtItem } from '../types';

// Même origine par défaut (le serveur Express sert l'API ET le build front
// en production ; en dev, Vite proxifie /api vers le serveur — voir
// vite.config.ts). VITE_API_URL permet de pointer vers une API hébergée
// séparément si besoin.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '';

const TOKEN_KEY = 'ff_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return undefined as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // pas de corps JSON (ex: erreur réseau générique)
  }

  if (!res.ok) {
    if (res.status === 401) setToken(null);
    throw new ApiError(res.status, body?.error || "Une erreur est survenue, réessayez.");
  }

  return body as T;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export const api = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => request<{ user: { id: string; email: string } }>('/auth/me'),

  listTransactions: () => request<Transaction[]>('/transactions'),
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) =>
    request<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id: string, data: Omit<Transaction, 'id' | 'createdAt'>) =>
    request<Transaction>(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id: string) => request<void>(`/transactions/${id}`, { method: 'DELETE' }),

  listDebts: () => request<DebtItem[]>('/debts'),
  createDebt: (data: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) =>
    request<DebtItem>('/debts', { method: 'POST', body: JSON.stringify(data) }),
  updateDebt: (id: string, data: Omit<DebtItem, 'id' | 'repayments' | 'createdAt'>) =>
    request<DebtItem>(`/debts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDebt: (id: string) => request<void>(`/debts/${id}`, { method: 'DELETE' }),
  addRepayment: (debtId: string, data: { amount: number; date: string; paymentMode: string; note?: string }) =>
    request<{ debt: DebtItem; transaction: Transaction }>(`/debts/${debtId}/repayments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  wipeAllData: () => request<void>('/data', { method: 'DELETE' }),
};
