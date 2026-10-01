import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Vraie base de données SQL embarquée (SQLite via le module natif `node:sqlite`
// livré avec Node.js — aucune dépendance native à compiler, aucun service
// externe à provisionner). Le fichier est stocké sur disque et survit aux
// redémarrages du serveur ; c'est la source de vérité unique partagée par
// tous les appareils (PC, téléphone...) qui se connectent à ce serveur.
const DB_PATH = process.env.DB_PATH || './data/financeflow.db';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    comment TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

  CREATE TABLE IF NOT EXISTS debts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_or_company TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('receivable', 'payable')),
    description TEXT NOT NULL,
    initial_amount REAL NOT NULL,
    remaining_amount REAL NOT NULL,
    due_date TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'overdue', 'paid')),
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_debts_user ON debts(user_id);

  CREATE TABLE IF NOT EXISTS repayments (
    id TEXT PRIMARY KEY,
    debt_id TEXT NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    note TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_repayments_debt ON repayments(debt_id);
`);

export const newId = (prefix) => `${prefix}-${randomUUID()}`;
