# Déploiement sur Railway

## 1. Pousser le code sur GitHub

Ce dossier est déjà un dépôt Git local (`git init` a été fait, premier
commit créé). Il ne reste qu'à le publier :

1. Crée un nouveau dépôt **vide** sur https://github.com/new (ne coche
   aucune case "Initialize with README" pour éviter un conflit).
2. Dans ce dossier :
   ```bash
   git remote add origin https://github.com/<ton-compte>/<nom-du-repo>.git
   git branch -M main
   git push -u origin main
   ```
   (Ou plus simple : ouvre **GitHub Desktop**, "Add local repository" →
   sélectionne ce dossier → "Publish repository".)

## 2. Créer le projet sur Railway

1. Va sur https://railway.app et connecte-toi (ou crée un compte).
2. **New Project → Deploy from GitHub repo** → sélectionne ton dépôt.
3. Railway détecte automatiquement Node.js (via `railway.toml` déjà
   présent dans le dépôt : build = `npm run build`, start = `npm start`).

## 3. Ajouter un disque persistant (obligatoire pour SQLite)

Sans ça, la base de données serait effacée à chaque redéploiement.

1. Sur le service → onglet **Volumes** → **New Volume**.
2. Mount path : `/data`.

## 4. Variables d'environnement

Sur le service → onglet **Variables**, ajoute :

| Variable | Valeur |
|---|---|
| `JWT_SECRET` | Un secret long et aléatoire — **ne réutilise pas** celui de ton `.env` local. Un a été généré pour toi (transmis séparément, ne le commite jamais). |
| `DB_PATH` | `/data/financeflow.db` |
| `NODE_ENV` | `production` |

(`PORT` et `HOST` n'ont rien à faire ici : Railway injecte `PORT`
automatiquement et le serveur écoute déjà sur `0.0.0.0`.)

## 5. Domaine public

Railway génère automatiquement une URL HTTPS
(`https://<projet>.up.railway.app`) sous l'onglet **Settings → Networking
→ Generate Domain**. C'est cette URL que tu ouvriras depuis ton téléphone.

## 6. Vérification post-déploiement

- Ouvre l'URL Railway → tu dois voir l'écran de connexion (base vide,
  aucune donnée démo).
- Crée un compte, ajoute une transaction test, rafraîchis la page :
  la donnée doit persister (preuve que le volume `/data` fonctionne).
- Depuis ton téléphone, ouvre la même URL, connecte-toi avec le même
  compte : les données doivent apparaître.

## Mises à jour futures

Chaque `git push` sur `main` redéploie automatiquement (Railway écoute
le dépôt GitHub connecté).
