# Quick Start Guide - Chalet Familial

## 🎯 Démarrage Rapide

### Pour une utilisation immédiate (Mode Local)

L'application fonctionne immédiatement en mode localStorage. Aucune configuration requise !

```bash
npm install
npm run dev
```

Visitez `http://localhost:5173` et créez votre premier compte administrateur.

**Note :** En mode local, les données sont stockées dans votre navigateur uniquement.

---

### Pour un déploiement avec base de données (Mode Production)

Pour partager l'application avec votre famille avec synchronisation des données :

#### 1. Déployer sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mttwln/chalet-familial)

Ou manuellement :
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project" et importez ce repository
3. **IMPORTANT :** Avant de déployer, ajoutez la base de données

#### 2. Ajouter Vercel Postgres

Dans les paramètres du projet sur Vercel :
1. Allez dans "Storage" → "Create Database"
2. Sélectionnez "Postgres"
3. Choisissez un nom (ex: `chalet-db`)
4. Sélectionnez une région proche de vous
5. Cliquez sur "Create"

#### 3. Ajouter JWT_SECRET

1. Allez dans "Settings" → "Environment Variables"
2. Ajoutez :
   - **Name**: `JWT_SECRET`
   - **Value**: Une chaîne aléatoire de 32+ caractères
   - Générez avec : `openssl rand -base64 32`

#### 4. Déployer

Cliquez sur "Deploy" - c'est tout ! 🎉

La base de données s'initialisera automatiquement au premier lancement.

---

## 📱 Utilisation

### Premier compte

Le premier utilisateur à s'inscrire devient automatiquement **administrateur**.

**Credentials par défaut en mode local :**
- Email: `matthieu.weinlein@gmx.net`
- Mot de passe: `Admin2024!`

### Inviter des membres

Une fois connecté en tant qu'admin :
1. Un lien d'invitation apparaît sur la page de connexion
2. Copiez et partagez ce lien avec votre famille
3. Ils peuvent s'inscrire directement en tant qu'utilisateurs

### Rôles

- **Admin** : Gestion complète (membres, réservations, finances, consommation)
- **User** : Créer des réservations, consulter les données

---

## 🔧 Développement Local avec Base de Données

Pour tester avec la vraie base de données Vercel en local :

```bash
# Installer Vercel CLI
npm install -g vercel

# Lier le projet
vercel link

# Télécharger les variables d'environnement
vercel env pull

# Lancer en mode développement avec API
vercel dev
```

Votre application sera sur `http://localhost:3000` avec toutes les API routes fonctionnelles.

---

## ❓ Questions Fréquentes

### Dois-je utiliser la base de données ?

**Non**, c'est optionnel :
- **Sans base de données** : Fonctionne immédiatement, données locales au navigateur
- **Avec base de données** : Données synchronisées, connexion multi-appareils, production-ready

### Mes données localStorage seront-elles migrées ?

Pas automatiquement. Vous devrez recréer les comptes et réservations lors de la première utilisation avec la base de données.

### Puis-je changer de mode ?

Oui ! L'application détecte automatiquement le mode disponible :
- Si les API routes fonctionnent → Mode base de données
- Sinon → Mode localStorage

### C'est sécurisé ?

**Mode base de données** :
- ✅ Mots de passe hashés avec bcrypt
- ✅ Authentification JWT
- ✅ Validation côté serveur
- ✅ Protection CSRF

**Mode localStorage** :
- ⚠️  Données en clair dans le navigateur
- ⚠️  Pas de validation serveur
- ⚠️  Seulement pour tests/développement

---

## 📚 Documentation Complète

- [Guide de déploiement détaillé](./DEPLOYMENT_DATABASE.md)
- [Schéma de base de données](./lib/db/schema.sql)
- [Documentation des API](./DEPLOYMENT_DATABASE.md#-urls-des-api)

## 🆘 Support

Besoin d'aide ? Consultez :
1. [DEPLOYMENT_DATABASE.md](./DEPLOYMENT_DATABASE.md) pour le déploiement
2. Les logs Vercel en cas d'erreur
3. Ouvrez une issue sur GitHub
