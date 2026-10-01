import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { router } from './routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

const app = express();
// CSP désactivée : Express ne sert que l'API JSON + les assets statiques du
// build Vite (déjà servis avec des hash de contenu), pas de HTML dynamique
// à protéger ici ; les autres protections Helmet (nosniff, HSTS, etc.) restent actives.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Protection contre le bruteforce / spam de compte sur les routes
// d'authentification, où se trouvent les données les plus sensibles
// (identifiants). Le reste de l'API est protégé par le JWT lui-même.
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de tentatives, réessayez dans quelques minutes.' },
  })
);

// N'active un CORS permissif que si explicitement demandé (ex: frontend et
// API hébergés sur deux domaines distincts). Par défaut, l'app est servie
// en same-origin (proxy Vite en dev, fichiers statiques Express en prod),
// donc aucun CORS n'est nécessaire — la surface d'attaque reste minimale.
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
}

app.use('/api', router);

// En production, Express sert aussi le build front (dist/) : PC et
// téléphone accèdent à la même URL unique, qui sert à la fois la PWA et
// son API — un seul service à déployer.
app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

// Gestionnaire d'erreurs générique : ne jamais laisser fuiter une stack
// trace ou un détail interne au client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`[FinanceFlow API] en écoute sur http://${HOST}:${PORT}`);
});
