Vagabond Pulse est une application web de gestion d'événements et de souvenirs (photos), composée d'un backend **Node.js/Express + Sequelize/mySql** et d'un frontend **React**. Il s'agit du projet de fin d'année de la formation FSD de la 3wa. 
* S'incrire, se connecter/se déconnecter et gérer le profil utilisateur (RBAC: Role Based Access Management).
* Créer, consulter, modifier et supprimer leurs propres événements.
* Consulter et supprimer leurs propres photos-souvenirs.
* Explorer une galerie globale des souvenirs de tous les utilisateurs.
* Parcourir une liste paginée de tous les événements.
Un rôle **admin** permet également :
* De consulter, modifier ou supprimer n'importe quel utilisateur, événements et souvenirs.
Se readme décrit l'architecture mise en place dans ce projet, la configuration, les variables d'environnement, les scripts et comment lancer le backend et le frontend.
---
## Table des matières
- [Se readme décrit l'architecture mise en place dans ce projet, la configuration, les variables d'environnement, les scripts et comment lancer le backend et le frontend.](#se-readme-décrit-larchitecture-mise-en-place-dans-ce-projet-la-configuration-les-variables-denvironnement-les-scripts-et-comment-lancer-le-backend-et-le-frontend)
- [Table des matières](#table-des-matières)
- [Les technos utilisées :](#les-technos-utilisées-)
- [Architecture et arborescence :](#architecture-et-arborescence-)
- [Démarrage :](#démarrage-)
  - [Prérequis :](#prérequis-)
  - [Clonage et installation :](#clonage-et-installation-)
- [Backend](#backend)
  - [Configuration et .env](#configuration-et-env)
  - [Scripts principaux :](#scripts-principaux-)
  - [Endpoints API :](#endpoints-api-)
- [Frontend](#frontend)
  - [Configuration et .env](#configuration-et-env-1)
  - [Scripts principaux](#scripts-principaux)
  - [Routes et pages](#routes-et-pages)
- [Console admin](#console-admin)
- [Interface construite avec React et stylée avec SCSS, accessible et responsive (mobile-first)](#interface-construite-avec-react-et-stylée-avec-scss-accessible-et-responsive-mobile-first)
---

## Les technos utilisées :
* **Backend** :
  * Node.js, Express
  * Sequelize (MySQL)
  * Authentification JWT, Bcrypt pour le hashage
  * Multer pour l'upload des fichiers
  * Helmet, hsts, rate-limiting, cors
* **Frontend** :
  * React (Vite)
  * React Router DOM
  * Axios pour les requêtes HTTP
  * Context API pour l'authentification
  * SCSS pour le styling
  * Material-UI pour les interfaces administrateur
* **Développement et deploiement** :
  * Dotenv pour la configuration
  * Nodemon pour le serveur du développement
  * Vite pour le build du front
  * Vercel pour le déploiement frontend
  * Render pour le déploiement backend
  * Aiven pour le déploiement de la base de données MySQL
---
## Architecture et arborescence :

```
vagabond-pulse/
├── backend/
│   ├── config/
│   │   └── database.js      
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── memory.controller.js
│   │   ├── user.controller.js
│   │   
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── models/              
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── events.route.js
│   │   ├── memories.route.js
│   │   ├── users.route.js
│   │ 
│   ├── uploads/            
│   ├── server.js
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── UsersTable.jsx  
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── CreateEvent.jsx
    │   │   ├── EventDetails.jsx
    │   │   ├── EditEvent.jsx
    │   │   ├── Admin.jsx
    │   │   ├── AdminEvents.jsx
    │   │   └── AdminMemories.jsx
    │   ├── styles/            
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── .env
    ├── package.json
    └── vite.config.js
```
---
## Démarrage :
### Prérequis :
* Node.js V16 +
* npm ou yarn ou bun
* base de données MySQL
### Clonage et installation :

```bash
git clone https://github.com/Laurasdt/vagabond-pulse.git
cd vagabond-pulse
```
---
## Backend 
```bash
cd backend
npm install
```

### Configuration et .env
Créer une fichier `backend/.env`:
```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=defaultdb
PORT=3001

JWT_SECRET=

NODE_ENV=development

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_PSEUDO=
```
### Scripts principaux :
* `npm run start:dev` - lancement en mode dev
* `npm run start:prod` - lancement en production
* `node scripts/seedAdmin.js` - initialisation du compte admin
### Endpoints API :
* **Auth**
  * `POST /api/auth/register` - inscription
  * `POST /api/auth/login` - connexion (retour JWT)
* **Utilisateurs**
  * `GET /api/users/` - liste users
  * `PUT /api/users/:id` - modifier le rôle
  * `DELETE /api/users/:id` - suppression d'un user
* **Evénements**
  * `GET /api/events` - liste events
  * `GET /api/events/:id` - récupération d'un événement par son id
  * `POST /api/events` - création (authentification requise)
  * `PUT /api/events/:id` - modification (authentification requise)
  * `DELETE /api/events/:id` - suppression (authentification requise)
* **Souvenirs**
  * `GET /api/memories` - liste des memories
  * `GET /api/memories/:userId` - récupération des memories d'un user
  * `POST /api/memories` - création (authentification requise)
  * `DELETE /api/memories/:id` - suppression (authentification requise)
## Frontend
```bash
cd frontend
npm install
```
### Configuration et .env
Créer une fichier `frontend/.env`:
```dotenv
VITE_API_URL=http://localhost:3001/api
```
### Scripts principaux
* `npm run dev` lancement du serveur Vite
* `npm run build` pour la production
### Routes et pages 
* `/`   - home
* `/login`   - login
* `/register`   - register
* `/profile`   - profile user
* `/gallery`   - galerie globale
* `/create-events`   - création d'un event
* `/event /:id`   - détails d'un event
* `/edit-event`   - modifier event
* `/users`   - liste des users pour admin
---
## Console admin
Admin peut :
* **CRUD utilisateurs**
* **Modérer événement**
* **Modérer souvenirs**
  Interface construite avec React et stylée avec SCSS, accessible et responsive (mobile-first) 
---
Laura Schmidt 
