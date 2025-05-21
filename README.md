Vagabond Pulse est une application web de gestion d'événements et de souvenirs (photos), composée d'un backend Node.js/Express et d'un frontend React. Il s'agit du projet de fin d'année de la formation FSD de la 3wa.

# Les technos utilisées :

- Backend : Node.js, Express.js
- Base de données : MySQL avec MAMP
- Frontend : React

# Prérequis :

- Node.js <= 14.x
- npm ou yarn
- Une base de données au choix (MongoDB, MySQL avec Mamp, PostgreSQL...)

# Installation :

1) Cloner le dépôt :
```
git clone https://github.com/Laurasdt/vagabond-pulse.git
cd backend
```
1) Installer les dépendances :
```npm install```
1) Démarrer le serveur de production :
```node server.js```
1) Démarrer en mode développement (avec reload automatique) :
(dans un autre terminal, depuis la base du projet)
```
npm install
npm run dev
```

L'application sera accessible par défaut sur http://localhost:3000/ et communiquera avec le backend sur http://localhost:5000/.

# Configuration :

- Backend :

  Créer un fichier .env à la racine du dossier backend et ajouter les variables d'environnement suivantes :

        Avec MySQL (MAMP) :
            PORT=5000
            DB_HOST=127.0.0.1
            DB_PORT=3306
            DB_USER=root
            DB_PASSWORD=root
            DB_NAME=vagabondpulse
            JWT_SECRET=<votre_clé_secrète>

        Assurez-vous de créer la base de données MySQL avant de démarrer le serveur :
            CREATE DATABASE `vagabondpulse` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Usage :

- Inscription : créer un nouveau compte via /register
- Connexion : se connecter via /login, récupérer un token JWT
- Créer un événement : accessible après authentification via /create-event
- Consulter les événements : liste et détails sur /events
- Profil utilisateur : gérer ses photos-souvenirs et ses événements sur /profile
- Consulter la galerie générale sur /gallery
- Modifier son (ou n'importe quel event si admin) événement si connecté, sur /edit-event
- Supprimer son event (ou n'importe quel event si admin)
