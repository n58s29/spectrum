# Changelog SPECTRUM

Toutes les modifications notables de ce projet sont documentées ici.  
Format : [Conventional Commits](https://www.conventionalcommits.org/fr/) — `feat`, `fix`, `docs`, `chore`, `refactor`.

---

## [0.1.1] — 2026-04-16

### fix
- Fond flou persistant après ajout d'une prestation au devis : `[hidden]` était écrasé par `display: flex` de `.modal-overlay`. Ajout de `[hidden] { display: none !important }` dans le reset CSS.

---

## [0.1.0] — 2026-04-16 — MVP

### feat
- **Catalogue** (`index.html`) : grille de 16 prestations FAN sur 4 catégories (espaces, IA générative, expérimentation, open innovation), filtre par catégorie, recherche plein texte, bouton "Démarrer un devis" avec pré-sélection du service
- **Configurateur de devis** (`devis.html`) : layout 1/3 + 2/3, formulaire d'informations client, catalogue compact filtrable, modal de configuration par prestation (tarif, participants, format, niveau, quantité, notes), prix calculé en temps réel
- **Récapitulatif temps réel** : sidebar abonnée aux événements `devis:updated`, affichage HT / TVA 20 % / TTC, suppression de ligne à la volée
- **Export PDF** : génération d'un DOM imprimable injecté dans le body, déclenchement de `window.print()`, feuille `print.css` dédiée (en-tête, tableau des lignes, totaux, pied de page)
- **Brouillons** (`brouillons.html`) : sauvegarde / chargement / duplication / suppression via `localStorage`, tableau avec statut et montant estimé, reprise d'un brouillon vers `devis.html`
- **Persistance inter-pages** : devis actif en `sessionStorage`, service pré-sélectionné en `sessionStorage`
- **Design system FAN** appliqué intégralement : palette `--primaire` / `--surface` / accents, typographie Avenir 300/400/500, zéro bordure décorative, layout asymétrique 1/3 + 2/3, composants boutons / cartes / formulaires / modal / toast / tableaux

### chore
- Arborescence complète du projet : `css/tokens.css`, `css/base.css`, `css/components.css`, `css/pages/*.css`, `js/data/`, `js/models/`, `js/modules/`, `assets/`
- Modules ES natifs (`type="module"`) — aucune dépendance externe
- Favicon SVG monochrome FAN

### docs
- Initialisation du dépôt
- README avec architecture, catalogue, modèle de données, conventions
- CHANGELOG au format Conventional Commits
