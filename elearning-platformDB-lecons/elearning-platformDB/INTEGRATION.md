# Intégration Frontend ⇄ Backend — StudyLearn

Guide pour faire fonctionner le frontend React/Vite avec le backend NestJS.

## 1. Démarrer le backend (NestJS + MySQL)

1. Lancer MySQL (XAMPP) et créer la base **`elearning-db`** (vide — TypeORM crée les tables via `synchronize: true`).
2. Dans `elearning-backend/` :
   ```bash
   npm install
   npm run start:dev
   ```
3. Le serveur écoute sur **http://localhost:3001** et le CORS autorise déjà **http://localhost:5173** (Vite).

## 2. Démarrer le frontend (React + Vite)

1. Dans `elearning-platform/` :
   ```bash
   npm install
   npm run dev
   ```
2. L'URL du backend est lue depuis `.env` :
   ```
   VITE_API_URL=http://localhost:3001
   ```
   (Un fichier `.env` est déjà fourni ; `.env.example` documente la variable.)

## 3. Données de départ (pour voir des cours)

Le catalogue affiche les cours réels renvoyés par `GET /courses`. Au premier lancement la base est vide. Créez quelques données via Postman / Thunder Client :

1. **Inscription** d'un compte (route publique) :
   `POST http://localhost:3001/users/register`
   ```json
   { "firstName": "Mohamed", "lastName": "Diop", "email": "test@studylearn.app", "password": "azerty123" }
   ```
2. **Connexion** pour récupérer un token :
   `POST http://localhost:3001/auth/login` → copier `access_token`.
3. **Créer une catégorie** (route protégée — header `Authorization: Bearer <token>`) :
   `POST /categories` → `{ "nom": "Développement Web" }`
4. **Créer un cours** (protégé) :
   `POST /courses`
   ```json
   { "titre": "React pour débutants", "description": "Bases de React", "instructeur": "M. Sow", "niveau": "debutant", "dureeHeures": 8, "categoryId": 1 }
   ```

> Astuce : le nom de la catégorie (`nom`) doit correspondre au libellé d'une carte de la page d'accueil (« Développement Web », « Design & UX », « Data & IA », « Cybersécurité », « Mobile », « Cloud & DevOps ») pour que le filtre `?cat=` de la page Catalogue retrouve les cours.

## 4. Ce qui est maintenant relié au backend

| Élément | Route backend |
|---|---|
| Connexion | `POST /auth/login` |
| Inscription | `POST /users/register` (+ login auto) |
| Page Catalogue (liste) | `GET /courses` |
| Bouton « S'inscrire » d'un cours | `POST /enrollments` |
| Dashboard → Mes cours / Progression | `GET /enrollments/user/:id` |
| Dashboard → Certificats | `GET /certificates/user/:id` |
| Bouton « Rafraîchir » | recharge les deux ci-dessus |
| Widget météo du dashboard | `GET /weather` (API externe Open-Meteo, sans clé) |

Toutes les requêtes passent par **`src/services/api.ts`** (gestion centralisée du token JWT).

## 5. Boutons de la page d'accueil (routes ajoutées)

| Bouton | Action |
|---|---|
| Nav « Catalogue », Héro « Voir le catalogue », cartes filières | → `/catalogue` (les cartes ajoutent `?cat=<filière>`) |
| Nav « Méthode » | défilement vers la section Méthode |
| Nav « Tarifs » | défilement vers la section d'appel à l'action |
| « Connexion » / « S'inscrire » / « Commencer » / « Créer un compte » | `/login` ou `/inscription` |
| Footer « Contact » | `mailto:` |
| Footer « CGU » | retour haut de page |

## 6. Notes

- Les graphiques mensuels (courbe, barres, camembert de catégories) restent illustratifs : le backend ne fournit pas de séries temporelles. En revanche les 4 cartes de stats, le tableau « Mes cours » et la jauge de progression moyenne utilisent les vraies données.
- Le token et l'utilisateur sont conservés dans `localStorage` ; « Déconnexion » les efface.

## 7. RBAC (autorisation par rôles)

Le backend applique désormais un contrôle par rôles (`user`, `instructor`, `admin`) :
- La gestion des cours/catégories/utilisateurs (panneau admin) exige un compte **admin**.
- Pour promouvoir un compte : `UPDATE user SET role='admin' WHERE email='...';` dans phpMyAdmin.
- Un utilisateur `user` qui tente une action admin reçoit un **403 Forbidden**.

## 8. Documentation API

Swagger est disponible sur **http://localhost:3001/api/docs** (bouton *Authorize* pour coller le JWT).

## 9. Contenu des cours (leçons)

Chaque cours peut contenir des **leçons** : un titre, une durée, un **lien vidéo YouTube**
et/ou un **contenu écrit**. Nouvelle table `lesson` (relation ManyToOne vers `course`,
créée automatiquement par TypeORM).

- **Côté admin/instructeur** : onglet Cours → icône 🎬 sur la ligne d'un cours → gérer ses leçons.
- **Côté étudiant** : « Mes cours » → bouton **Suivre** → lecteur avec la vidéo intégrée,
  le cours écrit et le sommaire. Chaque leçon validée met à jour la progression réelle
  (`PUT /enrollments/:id`) ; à 100 % le statut passe à `termine`.
- Si un cours n'a pas encore de leçons, le lecteur affiche des chapitres génériques.
