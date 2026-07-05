# 🎓 StudyLearn — Backend API REST (NestJS)

API REST complète pour la plateforme e-learning StudyLearn.
Stack : **NestJS · TypeORM · MySQL · JWT · RBAC · bcrypt · Swagger**

---

## ⚙️ Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Créer la base de données MySQL (XAMPP ou MySQL Workbench)
#    Nom : elearning-db
#    (les tables se créent automatiquement grâce à synchronize: true)

# 4. Démarrer en mode développement
npm run start:dev
```

Le serveur tourne sur **http://localhost:3001**
📖 Documentation Swagger : **http://localhost:3001/api/docs**

---

## 🗄️ Base de données

Créer la base dans phpMyAdmin ou MySQL Workbench :
```sql
CREATE DATABASE `elearning-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

La connexion est configurée via le fichier `.env` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`) grâce à `@nestjs/config`.

---

## 🔐 Authentification & RBAC

- **Authentification JWT** : `POST /auth/login` retourne un `access_token` (validité 1 h) à envoyer dans le header `Authorization: Bearer <token>`.
- **Autorisation par rôles (RBAC)** : le rôle (`user`, `instructor`, `admin`) est embarqué dans le JWT. Un `RolesGuard` couplé au décorateur `@Roles()` restreint les routes sensibles :

| Rôle | Droits |
|------|--------|
| `user` | S'inscrire aux cours, suivre sa progression, consulter ses certificats |
| `instructor` | + créer/modifier des cours, délivrer des certificats |
| `admin` | + gérer les utilisateurs, catégories, et tout supprimer |

- Le mot de passe est **hashé avec bcrypt** et **jamais renvoyé** par l'API (`select: false` sur la colonne).

> 💡 Pour tester le RBAC : créez un compte via `/users/register` (rôle `user` par défaut), puis passez-le `admin` directement dans phpMyAdmin (`UPDATE user SET role='admin' WHERE id=1;`).

---

## 🌍 API externe intégrée — Open-Meteo

Conformément aux consignes, le backend consomme une **API externe gratuite** :
[Open-Meteo](https://open-meteo.com) (météo, **sans clé API**).

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /weather | ❌ | Météo actuelle (Dakar par défaut) — `?lat=&lon=&ville=` optionnels |

La météo est affichée sur le **tableau de bord du frontend**.

---

## 📡 Routes de l'API

Légende : ❌ public · ✅ JWT (tout utilisateur connecté) · 🛡️ rôles spécifiques

### AUTH
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /auth/login | ❌ | Connexion → retourne un JWT |

### USERS
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /users/register | ❌ | Inscription |
| GET | /users | 🛡️ admin | Liste des utilisateurs |
| GET | /users/:id | ✅ JWT | Un utilisateur |
| PUT | /users/:id | 🛡️ admin | Modifier un utilisateur |
| DELETE | /users/:id | 🛡️ admin | Supprimer un utilisateur |

### CATEGORIES
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /categories | ❌ | Liste des catégories |
| GET | /categories/:id | ❌ | Une catégorie |
| POST | /categories | 🛡️ admin | Créer une catégorie |
| PUT | /categories/:id | 🛡️ admin | Modifier une catégorie |
| DELETE | /categories/:id | 🛡️ admin | Supprimer une catégorie |

### COURSES
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /courses | ❌ | Liste des cours |
| GET | /courses/:id | ❌ | Un cours |
| POST | /courses | 🛡️ admin, instructor | Créer un cours |
| PUT | /courses/:id | 🛡️ admin, instructor | Modifier un cours |
| DELETE | /courses/:id | 🛡️ admin | Supprimer un cours |

### ENROLLMENTS (Inscriptions)
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /enrollments | ✅ JWT | S'inscrire à un cours (incrémente `nbInscrits`) |
| GET | /enrollments | 🛡️ admin | Toutes les inscriptions |
| GET | /enrollments/user/:userId | ✅ JWT | Cours d'un étudiant |
| GET | /enrollments/:id | ✅ JWT | Une inscription |
| PUT | /enrollments/:id | ✅ JWT | Mettre à jour la progression |
| DELETE | /enrollments/:id | ✅ JWT | Se désinscrire (décrémente `nbInscrits`) |

### CERTIFICATES
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | /certificates | 🛡️ admin, instructor | Délivrer un certificat |
| GET | /certificates | 🛡️ admin | Tous les certificats |
| GET | /certificates/user/:userId | ✅ JWT | Certificats d'un étudiant |
| GET | /certificates/:id | ✅ JWT | Un certificat |
| DELETE | /certificates/:id | 🛡️ admin | Supprimer un certificat |

### LESSONS (Contenu des cours)
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /lessons/course/:courseId | ✅ JWT | Leçons d'un cours (dans l'ordre) |
| GET | /lessons/:id | ✅ JWT | Une leçon |
| POST | /lessons | 🛡️ admin, instructor | Ajouter une leçon (texte et/ou vidéo YouTube) |
| PUT | /lessons/:id | 🛡️ admin, instructor | Modifier une leçon |
| DELETE | /lessons/:id | 🛡️ admin, instructor | Supprimer une leçon |

### WEATHER (API externe)
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | /weather | ❌ | Météo actuelle via Open-Meteo |

---

## 🧱 Gestion des erreurs

L'API renvoie des codes HTTP cohérents :
- **400** — données invalides (class-validator)
- **401** — token absent/expiré (JWT)
- **403** — rôle insuffisant (RBAC)
- **404** — ressource introuvable
- **409** — conflit (email déjà utilisé, déjà inscrit au cours)
- **503** — API externe injoignable
