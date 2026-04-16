# SPECTRUM — Générateur de devis FAN

Outil interne de la **Fabrique de l'Adoption Numérique (FAN)** pour créer, configurer et exporter des devis sur le catalogue de services FAN / e.SNCF Solutions.

## Fonctionnalités

- Parcourir le catalogue de services FAN (espaces, programmes GenAI, conseil)
- Sélectionner et configurer des prestations (durée, participants, format, niveau)
- Visualiser le récapitulatif du devis en temps réel
- Exporter le devis en PDF
- Sauvegarder et reprendre un brouillon

## Stack

HTML · CSS · JavaScript vanilla — aucun framework, aucun bundler.  
Design system : charte graphique FAN « L'Architecte Souverain ».

## Structure du projet

```
spectrum/
├── index.html          # Catalogue des services
├── devis.html          # Configurateur + récapitulatif
├── brouillons.html     # Gestion des brouillons
├── print.css           # Feuille de style export PDF
├── css/
│   ├── tokens.css      # Variables CSS design system FAN
│   ├── base.css        # Reset, typographie, layout global
│   ├── components.css  # Boutons, cartes, formulaires, tableaux
│   └── pages/          # Styles spécifiques par page
├── js/
│   ├── data/           # Catalogue statique (services, options, tarifs)
│   ├── models/         # Classe Devis — modèle de données et logique métier
│   ├── modules/        # Catalogue, configurateur, récap, PDF, brouillons
│   └── app.js          # Initialisation et orchestration
└── assets/             # Favicon SVG, icônes catégories
```

## Lancer l'application

Ouvrir `index.html` directement dans le navigateur — aucune installation requise.

Pour le développement, un serveur local est recommandé afin d'éviter les restrictions CORS sur les modules ES :

```bash
npx serve .
# ou
python -m http.server 8080
```

## Modèle de données (brouillon)

Les brouillons sont persistés dans le `localStorage` du navigateur.  
Le devis en cours de saisie transite entre les pages via `sessionStorage`.

```json
{
  "id": "uuid",
  "meta": { "nom": "...", "client": "...", "statut": "brouillon" },
  "lignes": [
    {
      "serviceId": "prog-genai-sensibilisation",
      "options": { "duree": 1, "participants": 20, "format": "présentiel" },
      "prixUnitaire": 2400,
      "sousTotal": 2400
    }
  ],
  "totaux": { "htTotal": 2400, "tauxTva": 0.20, "ttcTotal": 2880 }
}
```

## Conventions de développement

- Zéro dépendance externe (pas de CDN, pas de npm)
- Toutes les couleurs déclarées exclusivement via les variables CSS `tokens.css`
- `font-weight` limité à 300, 400, 500 (charte FAN)
- Pas de `border: 1px solid` pour séparer du contenu — frontières tonales uniquement
- Modules ES natifs (`type="module"`) pour l'isolation des scopes

## Périmètre FAN

Outil interne — accès réservé aux équipes FAN / e.SNCF Solutions / Direction Numérique.
