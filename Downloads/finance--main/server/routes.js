import { Router } from 'express';
import { db, newId } from './db.js';
import { hashPassword, verifyPassword, signToken, requireAuth } from './auth.js';

export const router = Router();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/auth/register', async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Un compte existe déjà avec cet e-mail.' });
  }

  const passwordHash = await hashPassword(password);
  const user = { id: newId('user'), email: normalizedEmail, created_at: new Date().toISOString() };

  db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)').run(
    user.id,
    user.email,
    passwordHash,
    user.created_at
  );

  const token = signToken(user);
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'E-mail et mot de passe requis.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const row = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(normalizedEmail);

  // Message volontairement identique dans les deux cas d'échec (e-mail
  // inconnu ou mot de passe incorrect) pour ne pas révéler quels e-mails
  // sont enregistrés.
  if (!row) {
    return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
  }

  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
  }

  const token = signToken(row);
  res.json({ token, user: { id: row.id, email: row.email } });
});

router.get('/auth/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.userId);
  if (!row) return res.status(401).json({ error: 'Utilisateur introuvable.' });
  res.json({ user: row });
});

// Toutes les routes ci-dessous nécessitent une authentification et ne
// retournent/modifient jamais que les données de req.userId.
router.use(requireAuth);

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

function rowToTransaction(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    amount: row.amount,
    category: row.category,
    paymentMode: row.payment_mode,
    date: row.date,
    description: row.description || undefined,
    comment: row.comment || undefined,
    createdAt: row.created_at,
  };
}

router.get('/transactions', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC')
    .all(req.userId);
  res.json(rows.map(rowToTransaction));
});

router.post('/transactions', (req, res) => {
  const t = req.body || {};
  if (!t.type || !t.title || typeof t.amount !== 'number' || t.amount <= 0 || !t.category || !t.paymentMode || !t.date) {
    return res.status(400).json({ error: 'Champs de transaction manquants ou invalides.' });
  }

  const row = {
    id: newId('tx'),
    user_id: req.userId,
    type: t.type,
    title: String(t.title).trim(),
    amount: t.amount,
    category: t.category,
    payment_mode: t.paymentMode,
    date: t.date,
    description: t.description || null,
    comment: t.comment || null,
    created_at: new Date().toISOString(),
  };

  db.prepare(
    `INSERT INTO transactions (id, user_id, type, title, amount, category, payment_mode, date, description, comment, created_at)
     VALUES (@id, @user_id, @type, @title, @amount, @category, @payment_mode, @date, @description, @comment, @created_at)`
  ).run(row);

  res.status(201).json(rowToTransaction(row));
});

router.put('/transactions/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Opération introuvable.' });

  const t = req.body || {};
  if (!t.type || !t.title || typeof t.amount !== 'number' || t.amount <= 0 || !t.category || !t.paymentMode || !t.date) {
    return res.status(400).json({ error: 'Champs de transaction manquants ou invalides.' });
  }

  db.prepare(
    `UPDATE transactions
     SET type = ?, title = ?, amount = ?, category = ?, payment_mode = ?, date = ?, description = ?, comment = ?
     WHERE id = ? AND user_id = ?`
  ).run(t.type, String(t.title).trim(), t.amount, t.category, t.paymentMode, t.date, t.description || null, t.comment || null, req.params.id, req.userId);

  const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  res.json(rowToTransaction(updated));
});

router.delete('/transactions/:id', (req, res) => {
  const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Opération introuvable.' });
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Debts + repayments
// ---------------------------------------------------------------------------

function rowToDebt(row, repayments) {
  return {
    id: row.id,
    personOrCompany: row.person_or_company,
    type: row.type,
    description: row.description,
    initialAmount: row.initial_amount,
    remainingAmount: row.remaining_amount,
    dueDate: row.due_date || undefined,
    status: row.status,
    repayments: repayments.map((r) => ({
      id: r.id,
      amount: r.amount,
      date: r.date,
      paymentMode: r.payment_mode,
      note: r.note || undefined,
    })),
    createdAt: row.created_at,
  };
}

const repaymentsStmt = db.prepare('SELECT * FROM repayments WHERE debt_id = ? ORDER BY date DESC, rowid DESC');

router.get('/debts', (req, res) => {
  const rows = db.prepare('SELECT * FROM debts WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json(rows.map((row) => rowToDebt(row, repaymentsStmt.all(row.id))));
});

router.post('/debts', (req, res) => {
  const d = req.body || {};
  if (!d.personOrCompany || !d.type || typeof d.initialAmount !== 'number' || d.initialAmount <= 0) {
    return res.status(400).json({ error: 'Champs de dette manquants ou invalides.' });
  }

  const row = {
    id: newId('debt'),
    user_id: req.userId,
    person_or_company: String(d.personOrCompany).trim(),
    type: d.type,
    description: d.description || (d.type === 'receivable' ? 'Prêt accordé' : 'Emprunt à rembourser'),
    initial_amount: d.initialAmount,
    remaining_amount: d.initialAmount,
    due_date: d.dueDate || null,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  db.prepare(
    `INSERT INTO debts (id, user_id, person_or_company, type, description, initial_amount, remaining_amount, due_date, status, created_at)
     VALUES (@id, @user_id, @person_or_company, @type, @description, @initial_amount, @remaining_amount, @due_date, @status, @created_at)`
  ).run(row);

  res.status(201).json(rowToDebt(row, []));
});

router.put('/debts/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM debts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Dette introuvable.' });

  const d = req.body || {};
  if (!d.personOrCompany || !d.type || typeof d.initialAmount !== 'number' || d.initialAmount <= 0) {
    return res.status(400).json({ error: 'Champs de dette manquants ou invalides.' });
  }

  // Si le montant initial change, on préserve ce qui a déjà été remboursé
  // plutôt que d'écraser le solde restant.
  const alreadyRepaid = existing.initial_amount - existing.remaining_amount;
  const newRemaining = Math.max(0, d.initialAmount - alreadyRepaid);
  const newStatus = newRemaining <= 0 ? 'paid' : existing.status === 'paid' ? 'active' : existing.status;

  db.prepare(
    `UPDATE debts
     SET person_or_company = ?, type = ?, description = ?, initial_amount = ?, remaining_amount = ?, due_date = ?, status = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    String(d.personOrCompany).trim(),
    d.type,
    d.description || (d.type === 'receivable' ? 'Prêt accordé' : 'Emprunt à rembourser'),
    d.initialAmount,
    newRemaining,
    d.dueDate || null,
    newStatus,
    req.params.id,
    req.userId
  );

  const updated = db.prepare('SELECT * FROM debts WHERE id = ?').get(req.params.id);
  res.json(rowToDebt(updated, repaymentsStmt.all(updated.id)));
});

router.delete('/debts/:id', (req, res) => {
  const result = db.prepare('DELETE FROM debts WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Dette introuvable.' });
  res.status(204).end();
});

router.post('/debts/:id/repayments', (req, res) => {
  const debt = db.prepare('SELECT * FROM debts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!debt) return res.status(404).json({ error: 'Dette introuvable.' });

  const r = req.body || {};
  if (typeof r.amount !== 'number' || r.amount <= 0 || !r.date || !r.paymentMode) {
    return res.status(400).json({ error: 'Champs de versement manquants ou invalides.' });
  }

  const repayment = {
    id: newId('rep'),
    debt_id: debt.id,
    amount: r.amount,
    date: r.date,
    payment_mode: r.paymentMode,
    note: r.note || null,
  };
  db.prepare('INSERT INTO repayments (id, debt_id, amount, date, payment_mode, note) VALUES (@id, @debt_id, @amount, @date, @payment_mode, @note)').run(repayment);

  const newRemaining = Math.max(0, debt.remaining_amount - r.amount);
  const newStatus = newRemaining <= 0 ? 'paid' : debt.status;
  db.prepare('UPDATE debts SET remaining_amount = ?, status = ? WHERE id = ?').run(newRemaining, newStatus, debt.id);

  // Miroir du versement sous forme d'opération, pour un suivi complet dans
  // "Dernières Opérations" (même comportement que l'ancienne logique client).
  const isReceivable = debt.type === 'receivable';
  const tx = {
    id: newId('tx'),
    user_id: req.userId,
    type: isReceivable ? 'income' : 'expense',
    title: `Remboursement (${debt.person_or_company})`,
    amount: r.amount,
    category: isReceivable ? 'Remboursement Reçu' : 'Autre',
    payment_mode: r.paymentMode,
    date: r.date,
    description: r.note || `Versement effectué pour ${debt.description}`,
    comment: null,
    created_at: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO transactions (id, user_id, type, title, amount, category, payment_mode, date, description, comment, created_at)
     VALUES (@id, @user_id, @type, @title, @amount, @category, @payment_mode, @date, @description, @comment, @created_at)`
  ).run(tx);

  const updatedDebt = db.prepare('SELECT * FROM debts WHERE id = ?').get(debt.id);
  res.status(201).json({ debt: rowToDebt(updatedDebt, repaymentsStmt.all(debt.id)), transaction: rowToTransaction(tx) });
});

// ---------------------------------------------------------------------------
// Wipe all data for the current user ("Effacer toutes les données")
// ---------------------------------------------------------------------------

router.delete('/data', (req, res) => {
  db.prepare('DELETE FROM transactions WHERE user_id = ?').run(req.userId);
  db.prepare('DELETE FROM debts WHERE user_id = ?').run(req.userId);
  res.status(204).end();
});
