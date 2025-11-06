# Chalet Familial - Gestion & Réservations 🏔️

Application web familiale pour gérer un chalet en France. Permet la réservation de séjours, le calcul des participations financières et le suivi des consommations énergétiques.

## 🚀 Fonctionnalités

- **Tableau de bord** - Vue d'ensemble des informations clés
- **Calendrier** - Gestion des réservations de séjour
- **Finances** - Calcul automatique des participations
- **Consommation** - Suivi des relevés énergétiques (fioul, électricité)
- **Gestion des membres** - Administration des utilisateurs (admin uniquement)

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

### Option 1 : Déploiement via GitHub (Recommandé)

1. Créez un compte sur [Vercel](https://vercel.com) si vous n'en avez pas
2. Cliquez sur "New Project" sur votre dashboard Vercel
3. Importez ce repository GitHub
4. Vercel détectera automatiquement la configuration Vite
5. Cliquez sur "Deploy"

Votre site sera en ligne en quelques minutes ! Vercel génèrera automatiquement une URL de production.

### Option 2 : Déploiement via CLI Vercel

1. Installez la CLI Vercel :
```bash
npm install -g vercel
```

2. Déployez depuis le répertoire du projet :
```bash
vercel
```

3. Suivez les instructions interactives
4. Pour déployer en production :
```bash
vercel --prod
```

### Configuration

Le fichier `vercel.json` est déjà configuré pour :
- Build automatique avec Vite
- Routage SPA (Single Page Application)
- Sortie dans le dossier `dist`

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
