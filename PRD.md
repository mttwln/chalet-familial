# Planning Guide

Application web familiale pour gérer un chalet en France, permettant la réservation de séjours, le calcul des participations financières et le suivi des consommations énergétiques.

**Experience Qualities**: 
1. **Chaleureux et accueillant** - L'interface évoque l'atmosphère d'un chalet de montagne familial avec des tons naturels et une ambiance cosy
2. **Clair et organisé** - Navigation intuitive permettant à tous les membres de la famille, quel que soit leur niveau technique, de gérer facilement leurs réservations
3. **Transparent et équitable** - Calculs financiers automatiques et visibles qui renforcent la confiance entre membres de la famille

**Complexity Level**: Light Application (multiple features with basic state)
  - L'application combine plusieurs modules fonctionnels (calendrier, réservations, finances, consommation) avec gestion d'état persistant mais sans complexité serveur

## Essential Features

**Module de gestion des membres**
- Functionality: Créer et gérer les profils des membres de la famille avec rôles (admin/utilisateur)
- Purpose: Identifier les utilisateurs et leurs permissions pour la gestion du chalet
- Trigger: Accès initial à l'application ou clic sur "Gérer les membres" (admin uniquement)
- Progression: Voir liste des membres → Ajouter/modifier membre → Saisir nom, email, rôle → Sauvegarder → Confirmation
- Success criteria: Membres enregistrés persistent, l'admin peut modifier les rôles, utilisateurs peuvent se connecter

**Calendrier de réservation interactif**
- Functionality: Visualiser et créer des réservations de séjour dans le chalet
- Purpose: Coordonner l'utilisation du chalet et éviter les conflits de dates
- Trigger: Clic sur "Calendrier" dans la navigation principale
- Progression: Vue mensuelle du calendrier → Sélectionner dates → Choisir membre et nombre de personnes → Confirmer → Réservation ajoutée visuellement
- Success criteria: Réservations affichées clairement, conflits de dates détectés, filtrage par membre possible

**Calcul automatique de participation aux frais**
- Functionality: Calculer la contribution financière de chaque membre basée sur la durée et le nombre de personnes
- Purpose: Répartir équitablement les coûts fixes du chalet
- Trigger: Consultation de l'onglet "Finances" ou après création de réservation
- Progression: Voir tableau récapitulatif → Filtrer par période/membre → Voir détail du calcul → Exporter données
- Success criteria: Calculs précis basés sur les réservations, affichage clair du montant par membre, formule transparente

**Suivi de consommation énergétique**
- Functionality: Enregistrer et visualiser les relevés de fioul et électricité
- Purpose: Suivre les dépenses énergétiques et identifier les tendances de consommation
- Trigger: Clic sur "Consommation" puis "Ajouter un relevé"
- Progression: Sélectionner type (fioul/électricité) → Entrer date, quantité, coût → Sauvegarder → Voir graphique mis à jour
- Success criteria: Historique complet des relevés, graphiques d'évolution clairs, calcul de coût moyen par période

**Tableau de bord d'accueil**
- Functionality: Vue d'ensemble des informations clés du chalet
- Purpose: Accès rapide aux prochaines réservations, statistiques et alertes
- Trigger: Connexion à l'application
- Progression: Affichage automatique → Voir prochains séjours, soldes financiers, derniers relevés → Clic pour accéder aux modules détaillés
- Success criteria: Informations pertinentes visibles en un coup d'œil, navigation rapide vers sections

## Edge Case Handling

- **Réservations qui se chevauchent**: Détection automatique et alerte visuelle empêchant la double réservation
- **Suppression d'un membre avec réservations**: Confirmation requise, option de réassigner ou archiver les réservations existantes
- **Dates de réservation dans le passé**: Affichage en lecture seule, marquées comme "Terminées"
- **Calculs avec zéro réservation**: Affichage d'un état vide encourageant à créer une première réservation
- **Relevés de consommation manquants**: Message informatif dans les graphiques indiquant les périodes sans données
- **Navigation sans membre sélectionné**: Sélection automatique ou guidage vers création de profil

## Design Direction

Le design doit évoquer la sérénité et la chaleur d'un chalet de montagne alpin, avec une interface épurée qui inspire la confiance. Ambiance minimaliste mais accueillante, privilégiant la clarté fonctionnelle tout en conservant une touche de convivialité familiale à travers des éléments visuels subtils rappelant la montagne et le bois naturel.

## Color Selection

Palette analogique inspirée des paysages alpins (bleu glacier, blanc neige, tons bois)

- **Primary Color**: Bleu glacier profond `oklch(0.55 0.08 240)` - Évoque les montagnes et inspire confiance et stabilité pour les actions principales
- **Secondary Colors**: 
  - Bois clair chaud `oklch(0.75 0.04 60)` - Apporte chaleur et connexion au chalet
  - Blanc neige `oklch(0.98 0.005 60)` - Arrière-plans légers et espaces respirants
- **Accent Color**: Bleu vif alpin `oklch(0.65 0.15 240)` - Pour les call-to-actions et éléments interactifs importants
- **Foreground/Background Pairings**:
  - Background (Blanc crème `oklch(0.98 0.005 60)`): Texte principal gris anthracite `oklch(0.25 0.01 240)` - Ratio 13.2:1 ✓
  - Card (Blanc pur `oklch(0.99 0 0)`): Texte gris foncé `oklch(0.25 0.01 240)` - Ratio 13.5:1 ✓
  - Primary (Bleu glacier `oklch(0.55 0.08 240)`): Texte blanc `oklch(0.99 0 0)` - Ratio 7.1:1 ✓
  - Secondary (Bois clair `oklch(0.75 0.04 60)`): Texte gris foncé `oklch(0.25 0.01 240)` - Ratio 4.8:1 ✓
  - Accent (Bleu vif `oklch(0.65 0.15 240)`): Texte blanc `oklch(0.99 0 0)` - Ratio 5.2:1 ✓
  - Muted (Gris doux `oklch(0.92 0.005 240)`): Texte gris moyen `oklch(0.45 0.02 240)` - Ratio 6.8:1 ✓

## Font Selection

Les typographies doivent communiquer modernité et lisibilité tout en conservant une touche de chaleur, utilisant Inter pour sa clarté exceptionnelle et sa polyvalence dans les interfaces données-intensives.

- **Typographic Hierarchy**: 
  - H1 (Titre principal): Inter Bold / 32px / tracking tight / line-height 1.2
  - H2 (Titres de section): Inter Semibold / 24px / tracking normal / line-height 1.3
  - H3 (Sous-titres): Inter Medium / 18px / tracking normal / line-height 1.4
  - Body (Texte courant): Inter Regular / 15px / tracking slight / line-height 1.6
  - Caption (Métadonnées): Inter Regular / 13px / tracking wide / line-height 1.5
  - Button (Boutons): Inter Medium / 14px / tracking slight / line-height 1

## Animations

Les animations doivent être subtiles et fonctionnelles, évoquant la fluidité naturelle sans jamais ralentir l'utilisateur - chaque mouvement guide l'attention vers l'information importante ou confirme une action réussie.

- **Purposeful Meaning**: Transitions douces rappelant le mouvement paisible de la neige qui tombe, renforçant l'ambiance calme du chalet
- **Hierarchy of Movement**: 
  - Priorité haute: Confirmations de réservation (animation de succès visible)
  - Priorité moyenne: Transitions entre modules (slide subtile)
  - Priorité basse: Hover states sur boutons (simple scale 1.02)

## Component Selection

- **Components**: 
  - Calendar (shadcn) avec customisation pour afficher les réservations multi-jours
  - Card pour chaque module du tableau de bord avec subtle shadow
  - Table pour liste des réservations et tableau financier avec sorting
  - Dialog pour formulaires de réservation et ajout de relevés
  - Tabs pour navigation entre Fioul/Électricité dans consommation
  - Select pour choix des membres
  - Input et Textarea avec états focus marqués
  - Button avec variantes primary/secondary/ghost
  - Badge pour statuts de réservation (confirmée, en attente, passée)
  - Avatar pour représentation visuelle des membres
  - Sheet pour menu mobile responsive

- **Customizations**: 
  - Composant CalendarReservation custom combinant calendrier et overlay de réservations colorées
  - GraphiqueConsommation utilisant Recharts avec thème personnalisé aux couleurs alpines
  - FinanceTable custom avec calculs en temps réel et mise en évidence des totaux

- **States**: 
  - Buttons: Hover avec légère élévation (shadow-md), active avec scale 0.98, disabled avec opacity 50%
  - Inputs: Border accent au focus avec ring subtile, erreur en rouge destructive
  - Cards: Hover avec subtle shadow transition pour les éléments cliquables

- **Icon Selection**: 
  - House (chalet) pour accueil
  - Calendar pour réservations
  - CurrencyEuro pour finances
  - Lightning/Flame pour consommation électricité/fioul
  - Users pour gestion membres
  - Plus pour ajouts
  - ChartLine pour graphiques
  - Check/X pour confirmations/annulations

- **Spacing**: 
  - Containers: p-6 pour desktop, p-4 pour mobile
  - Sections: gap-8 pour séparation majeure, gap-4 pour groupes liés
  - Éléments de formulaire: gap-4 vertical, gap-2 pour labels
  - Grid layouts: gap-6 pour cards du dashboard

- **Mobile**: 
  - Navigation: Hamburger menu avec Sheet pour mobile (<768px), tabs horizontales pour desktop
  - Calendrier: Vue hebdomadaire sur mobile, mensuelle sur desktop
  - Tableaux: Scroll horizontal avec sticky première colonne sur mobile
  - Dashboard: Stack vertical des cards sur mobile, grid 2-3 colonnes sur desktop
  - Formulaires: Inputs full-width sur mobile, max-width optimal sur desktop
