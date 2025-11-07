# Guide de Déploiement avec Base de Données

Ce guide vous explique comment déployer l'application Chalet Familial avec une base de données PostgreSQL sur Vercel.

## 📋 Prérequis

- Un compte [Vercel](https://vercel.com) (gratuit)
- Le code source sur GitHub
- Node.js installé localement pour les tests

## 🚀 Déploiement sur Vercel avec Base de Données

### Étape 1 : Créer un nouveau projet Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub `chalet-familial`
4. Vercel détectera automatiquement qu'il s'agit d'un projet Vite
5. **NE CLIQUEZ PAS ENCORE SUR "DEPLOY"**

### Étape 2 : Ajouter Vercel Postgres

1. Dans la page de configuration du projet, allez dans l'onglet "Storage"
2. Cliquez sur "Create Database"
3. Sélectionnez "Postgres"
4. Choisissez un nom pour votre base de données (ex: `chalet-familial-db`)
5. Sélectionnez la région la plus proche de vos utilisateurs (ex: Frankfurt pour l'Europe)
6. Cliquez sur "Create"

Vercel va automatiquement ajouter les variables d'environnement nécessaires à votre projet :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Étape 3 : Ajouter la clé secrète JWT

1. Toujours dans la configuration du projet, allez dans "Settings" → "Environment Variables"
2. Ajoutez une nouvelle variable :
   - **Name**: `JWT_SECRET`
   - **Value**: Générez une chaîne aléatoire sécurisée (minimum 32 caractères)
   - Vous pouvez générer une clé avec : `openssl rand -base64 32`
3. Sélectionnez tous les environnements (Production, Preview, Development)
4. Cliquez sur "Save"

### Étape 4 : Déployer l'application

1. Retournez à l'onglet du projet
2. Cliquez sur "Deploy"
3. Attendez que le déploiement se termine (environ 2-3 minutes)

### Étape 5 : Initialiser la base de données

Une fois le déploiement terminé :

1. Ouvrez l'URL de votre application (ex: `https://chalet-familial.vercel.app`)
2. L'application va automatiquement initialiser la base de données lors de la première connexion
3. Créez votre premier compte administrateur

**Ou** vous pouvez initialiser manuellement en appelant :
```bash
curl -X POST https://votre-app.vercel.app/api/setup
```

## 🔧 Développement Local avec Vercel

### Installation de Vercel CLI

```bash
npm install -g vercel
```

### Lier votre projet local

```bash
cd chalet-familial
vercel link
```

Suivez les instructions pour lier votre projet local au projet Vercel.

### Récupérer les variables d'environnement

```bash
vercel env pull
```

Cela crée un fichier `.env.local` avec toutes les variables d'environnement de Vercel.

### Lancer le projet en local

```bash
# Installer les dépendances
npm install

# Lancer en mode développement avec Vercel CLI (recommandé)
vercel dev

# OU avec vite classique (mais sans les API routes)
npm run dev
```

L'application sera accessible sur `http://localhost:3000` avec Vercel CLI ou `http://localhost:5173` avec Vite.

### Tester les API routes localement

Avec `vercel dev`, toutes les API routes fonctionneront comme en production :
- `http://localhost:3000/api/login`
- `http://localhost:3000/api/register`
- `http://localhost:3000/api/members`
- etc.

## 📊 Structure de la Base de Données

L'application crée automatiquement les tables suivantes :

### Table `members`
- Stocke les utilisateurs/membres de la famille
- Champs : id, name, email, password_hash, role, avatar_color
- Le premier utilisateur devient automatiquement admin

### Table `reservations`
- Stocke les réservations du chalet
- Champs : id, member_id, start_date, end_date, number_of_people, status
- Validation : pas de chevauchement de dates

### Table `consumption_records`
- Stocke les relevés de consommation (fioul, électricité)
- Champs : id, type, date, quantity, cost, added_by

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT (JSON Web Tokens)
- Les tokens expirent après 7 jours
- Toutes les API routes nécessitent une authentification
- Les opérations admin sont restreintes aux utilisateurs admin

## 🔄 Mises à jour

Pour déployer de nouvelles versions :

```bash
# Commitez vos changements
git add .
git commit -m "Description des changements"
git push

# Vercel déploiera automatiquement
```

## 🆘 Dépannage

### La base de données ne s'initialise pas

1. Vérifiez les logs Vercel : Dashboard → Votre projet → Deployments → Logs
2. Assurez-vous que toutes les variables d'environnement sont définies
3. Essayez d'appeler manuellement `/api/setup` :
   ```bash
   curl -X POST https://votre-app.vercel.app/api/setup
   ```

### Erreur "Token invalide" après connexion

1. Vérifiez que `JWT_SECRET` est bien défini dans les variables d'environnement
2. Videz le cache du navigateur et reconnectez-vous
3. Assurez-vous que `JWT_SECRET` est identique en production et preview

### Les API routes ne fonctionnent pas localement

1. Utilisez `vercel dev` au lieu de `npm run dev`
2. Assurez-vous d'avoir exécuté `vercel env pull` pour récupérer les variables d'environnement
3. Vérifiez que les variables d'environnement sont dans `.env.local`

## 📱 Fonctionnalités

### Pour les utilisateurs
- ✅ Inscription et connexion sécurisées
- ✅ Créer des réservations
- ✅ Voir le calendrier des réservations
- ✅ Voir les finances et contributions
- ✅ Voir les consommations énergétiques

### Pour les administrateurs
- ✅ Toutes les fonctionnalités utilisateur
- ✅ Gérer les membres (modifier rôles, supprimer)
- ✅ Ajouter des relevés de consommation
- ✅ Vue complète sur toutes les données

## 🌐 URLs des API

Une fois déployé, votre application expose les endpoints suivants :

- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/setup` - Initialiser la base de données
- `GET /api/members` - Liste des membres
- `PUT /api/members` - Modifier un membre (admin)
- `DELETE /api/members` - Supprimer un membre (admin)
- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations` - Modifier une réservation
- `DELETE /api/reservations` - Supprimer une réservation
- `GET /api/consumption` - Liste des consommations
- `POST /api/consumption` - Ajouter une consommation
- `PUT /api/consumption` - Modifier une consommation
- `DELETE /api/consumption` - Supprimer une consommation

Tous les endpoints (sauf `/api/register`, `/api/login`, et `/api/setup`) nécessitent une authentification via header `Authorization: Bearer <token>`.
