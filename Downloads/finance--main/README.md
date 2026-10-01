# FinanceFlow

Application de gestion financière personnelle (revenus, dépenses, dettes) —
responsive, installable comme PWA sur Android/iPhone/PC, avec compte
utilisateur et synchronisation des données entre tous vos appareils via une
vraie base de données serveur (pas de localStorage).

## Architecture

- **Frontend** : React + Vite + Tailwind, PWA (manifest + service worker via
  `vite-plugin-pwa`).
- **Backend** : Express (dossier `server/`), API REST sous `/api`.
- **Base de données** : SQLite embarqué (`node:sqlite`, natif à Node.js —
  aucune dépendance à compiler), fichier stocké dans `data/` (ignoré par
  git, jamais commité).
- **Authentification** : mots de passe hashés (bcrypt), sessions par jeton
  JWT signé avec un secret défini en variable d'environnement.

## Lancer en local

**Prérequis :** Node.js ≥ 22.5

```bash
npm install
cp .env.example .env   # puis renseignez JWT_SECRET (voir le fichier)
npm run dev
```

Cela démarre en parallèle le serveur API (port 3001) et le frontend Vite
(port 3000, accessible aussi depuis le réseau local — donc depuis votre
téléphone via l'IP de votre PC affichée dans le terminal).

## Build de production

```bash
npm run build   # génère dist/ (frontend + manifest PWA + service worker)
npm start       # démarre le serveur Express qui sert dist/ + l'API sur un seul port
```

## Variables d'environnement

Voir `.env.example`. `JWT_SECRET` est obligatoire (le serveur refuse de
démarrer sans lui) ; ne le committez jamais.

## Nettoyer / réinitialiser les données locales

Supprimez le dossier `data/` pour repartir d'une base vide (irréversible).
