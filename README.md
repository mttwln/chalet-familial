# Chalet Familial - Gestion & Réservations 🏔️

Application web familiale pour gérer un chalet en France. Permet la réservation de séjours, le calcul des participations financières et le suivi des consommations énergétiques.

## 🚀 Fonctionnalités

- **Authentification sécurisée** - Inscription et connexion avec base de données PostgreSQL
- **Tableau de bord** - Vue d'ensemble des informations clés
- **Calendrier** - Gestion des réservations de séjour
- **Finances** - Calcul automatique des participations
- **Consommation** - Suivi des relevés énergétiques (fioul, électricité)
- **Gestion des membres** - Administration des utilisateurs (admin uniquement)

## 💾 Modes de Fonctionnement

L'application fonctionne en deux modes :

### Mode Base de Données (Production - Recommandé)
- Utilise **Vercel Postgres** pour le stockage des données
- Authentification JWT sécurisée
- Données partagées entre tous les utilisateurs et appareils
- Mots de passe hashés avec bcrypt

### Mode LocalStorage (Développement)
- Stockage dans le navigateur
- Pas de serveur requis
- Données locales uniquement
- Utile pour les tests locaux

L'application détecte automatiquement le mode disponible.

## 🛠️ Développement Local

### Installation

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

## 🌐 Déploiement sur Vercel

### Déploiement avec Base de Données PostgreSQL (Recommandé)

**Pour des instructions détaillées, consultez [DEPLOYMENT_DATABASE.md](DEPLOYMENT_DATABASE.md)**

Résumé rapide :
1. Créez un projet sur [Vercel](https://vercel.com)
2. Ajoutez **Vercel Postgres** à votre projet (Storage → Create Database → Postgres)
3. Ajoutez la variable d'environnement `JWT_SECRET` (Settings → Environment Variables)
4. Déployez l'application
5. La base de données s'initialisera automatiquement au premier lancement

### Déploiement Simple (Sans Base de Données)

Si vous voulez juste tester l'application sans base de données :

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas
2. Cliquez sur "New Project" sur votre dashboard Vercel
3. Importez ce repository GitHub
4. Vercel détectera automatiquement la configuration Vite
5. Cliquez sur "Deploy"

L'application fonctionnera en mode localStorage (données locales au navigateur).

### Configuration

Le fichier `vercel.json` est déjà configuré pour :
- Build automatique avec Vite
- Routage SPA (Single Page Application)
- Support des API routes (pour le mode base de données)
- Sortie dans le dossier `dist`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
