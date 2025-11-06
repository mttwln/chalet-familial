# Guide de Déploiement Vercel

Ce guide vous aidera à déployer l'application Chalet Familial sur Vercel pour que votre famille puisse l'utiliser en ligne.

## 🚀 Déploiement Rapide

### Méthode 1 : Import depuis GitHub (Recommandé)

C'est la méthode la plus simple et recommandée :

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Sign Up"
   - Connectez-vous avec votre compte GitHub (recommandé)

2. **Importer le projet**
   - Sur le dashboard Vercel, cliquez sur "Add New Project"
   - Sélectionnez "Import Git Repository"
   - Choisissez le repository `chalet-familial`
   - Cliquez sur "Import"

3. **Configuration**
   - Vercel détectera automatiquement qu'il s'agit d'un projet Vite
   - Les paramètres suivants seront automatiquement configurés :
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Vous n'avez rien à modifier !

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez quelques minutes que le build se termine
   - Votre site sera accessible via une URL du type : `chalet-familial-xxx.vercel.app`

### Méthode 2 : Via la CLI Vercel

Si vous préférez utiliser le terminal :

```bash
# Installer la CLI Vercel
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer (depuis le dossier du projet)
vercel

# Pour un déploiement en production
vercel --prod
```

## 🔄 Déploiements Automatiques

Une fois configuré, Vercel déploiera automatiquement :
- **Production** : À chaque push sur la branche `main`
- **Preview** : Pour chaque pull request créée

## 🌐 Nom de Domaine Personnalisé

Pour utiliser votre propre nom de domaine (ex: `chalet-famille-dupont.com`) :

1. Sur le dashboard Vercel, ouvrez votre projet
2. Allez dans l'onglet "Settings" > "Domains"
3. Cliquez sur "Add Domain"
4. Suivez les instructions pour configurer votre DNS

## 🔒 Variables d'Environnement

Cette application utilise le stockage local du navigateur, donc aucune variable d'environnement n'est nécessaire pour le moment. Si vous ajoutez une base de données externe plus tard, vous pourrez configurer les variables d'environnement dans :

Settings > Environment Variables

## 📊 Monitoring et Analytics

Vercel fournit automatiquement :
- Analytics de performance
- Logs de déploiement
- Métriques d'utilisation

Vous pouvez les consulter dans les onglets correspondants sur le dashboard.

## ⚡ Performance

L'application est optimisée pour Vercel avec :
- Build automatique via Vite
- Compression automatique des assets
- CDN global pour une livraison rapide
- Cache intelligent des ressources statiques

## 🆘 Aide et Support

En cas de problème :
- Consultez la [documentation Vercel](https://vercel.com/docs)
- Vérifiez les logs de build dans l'interface Vercel
- Assurez-vous que le build fonctionne localement avec `npm run build`

## 📱 Partager avec la Famille

Une fois déployé :
1. Copiez l'URL de votre site (ex: `https://chalet-familial-xxx.vercel.app`)
2. Partagez-la avec les membres de votre famille
3. Ils pourront y accéder depuis n'importe quel appareil (ordinateur, tablette, smartphone)

**Note** : Les données sont stockées localement dans le navigateur de chaque utilisateur. Si vous souhaitez un stockage centralisé partagé, une base de données externe devra être ajoutée dans une future version.
