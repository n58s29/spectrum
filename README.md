# SPECTRUM — Générateur de devis FAN

Outil interne de la **Fabrique de l'Adoption Numérique (FAN)** pour créer, configurer et exporter des devis sur le catalogue de services FAN / e.SNCF Solutions.

## Fonctionnalités

- Parcourir les 16 prestations du catalogue FAN (4 catégories)
- Filtrer par catégorie et rechercher en plein texte
- Configurer chaque prestation : tarif, participants, format, niveau, options
- Visualiser le récapitulatif du devis (HT / TVA / TTC) en temps réel
- Exporter le devis en PDF (`window.print()` + feuille dédiée)
- Sauvegarder et reprendre un brouillon (localStorage)
- Dupliquer un brouillon existant

## Stack

HTML · CSS · JavaScript vanilla — aucun framework, aucun bundler, zéro dépendance externe.  
Design system : charte graphique FAN « L'Architecte Souverain ».  
Modules ES natifs (`type="module"`).

## Structure du projet

```
spectrum/
├── index.html              # Catalogue des services
├── devis.html              # Configurateur + récapitulatif temps réel
├── brouillons.html         # Gestion des brouillons sauvegardés
├── print.css               # Feuille de style dédiée à l'export PDF
│
├── css/
│   ├── tokens.css          # Variables CSS design system FAN (single source of truth)
│   ├── base.css            # Reset, typographie, layouts, utilitaires
│   ├── components.css      # Boutons, cartes, formulaires, nav, footer, modal, toast
│   └── pages/
│       ├── catalogue.css   # Hero, filtres sidebar, grille de cartes
│       ├── devis.css       # Sidebar récap, configurateur, cartes compactes
│       └── brouillons.css  # Tableau, barre d'actions, état vide
│
├── js/
│   ├── data/
│   │   └── catalogue.js    # 16 services — tarifs HT, options, tags, catégories
│   ├── models/
│   │   └── devis.js        # Classe Devis — CRUD lignes, calculs, persistance
│   ├── modules/
│   │   ├── catalogue.js    # Rendu full (catalogue) et compact (devis), filtres
│   │   ├── configurateur.js# Modal de configuration d'une prestation, prix live
│   │   ├── recapitulatif.js# Abonné à devis:updated, re-render sidebar
│   │   ├── export-pdf.js   # Construction du DOM imprimable + window.print()
│   │   └── brouillons.js   # CRUD localStorage (sauvegarder, charger, dupliquer)
│   └── app.js              # Détection de page, initialisation conditionnelle
│
└── assets/
    └── favicon.svg         # Favicon SVG monochrome FAN
```

## Catalogue des prestations

| Catégorie | Couleur | Services |
|---|---|---|
| Location d'espaces | Cerulean | Salle 574, Grande salle événementielle, Open space créatif, Studio podcast |
| Ateliers IA Générative | Lavande | Sensibilisation GenAI, Prompt Engineering, Hackathon IA, Agents & Automatisation |
| Projets expérimentaux | Menthe | Sprint prototypage (5j), POC technologique, Dashboard analytique, IoT & capteurs |
| Open Innovation | Ambre | Analyse écosystème startup, Benchmark sectoriel, Co-création, Veille stratégique |

## Lancer l'application

Un serveur local est nécessaire pour les modules ES (`type="module"`) :

```bash
npx serve .
# ou
python -m http.server 8080
```

Puis ouvrir `http://localhost:3000` (ou `8080`).

## Modèle de données

Les brouillons sont persistés dans `localStorage` (clé `spectrum_brouillons`).  
Le devis actif transite entre pages via `sessionStorage` (clé `spectrum_devis_actif`).  
Le service pré-sélectionné depuis le catalogue transite via `spectrum_service_preselect`.

```json
{
  "id": "devis-1713261600000-abc1234",
  "version": 1,
  "meta": {
    "nom": "Atelier GenAI — DRPIC",
    "direction": "Direction Régionale Paris Île-de-France Centre",
    "contact": "Prénom Nom",
    "dateCreation": "2026-04-16T10:00:00.000Z",
    "dateModification": "2026-04-16T11:30:00.000Z",
    "statut": "brouillon",
    "notes": ""
  },
  "lignes": [
    {
      "id": "ligne-1713265200000",
      "serviceId": "gen-sensibilisation",
      "label": "Sensibilisation à l'IA Générative",
      "categorie": "genai",
      "tarifLabel": "Demi-journée (4h)",
      "configValues": { "participants": "20", "format": "presentiel", "quantite": 1 },
      "prixUnitaire": 2400,
      "quantite": 1,
      "sousTotal": 2400
    }
  ],
  "totaux": { "htTotal": 2400, "tauxTva": 0.20, "tvaTotal": 480, "ttcTotal": 2880 }
}
```

## Communication entre modules

La classe `Devis` émet un `CustomEvent('devis:updated')` sur `document` à chaque modification.  
`recapitulatif.js` y est abonné et re-rend la sidebar.  
`app.js` y est abonné pour persister en `sessionStorage`.

## Conventions de développement

- Zéro dépendance externe (pas de CDN, pas de npm)
- Toutes les couleurs via les variables CSS de `tokens.css` — aucune valeur hex en dur
- `font-weight` limité à 300, 400, 500 (charte FAN)
- Pas de `border: 1px solid` pour séparer du contenu — frontières tonales uniquement
- Pas de `transition: all` — propriétés ciblées explicitement
- Vouvoiement systématique dans tous les labels et messages UI

## Périmètre FAN

Outil interne — accès réservé aux équipes FAN / e.SNCF Solutions / Direction Numérique Groupe SNCF.
