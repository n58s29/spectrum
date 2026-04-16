/**
 * SPECTRUM — Point d'entrée principal
 * Détecte la page et initialise les modules correspondants
 */

const PAGE = document.body.dataset.page;

if (PAGE === 'catalogue')   initPageCatalogue();
if (PAGE === 'devis')       initPageDevis();
if (PAGE === 'brouillons')  initPageBrouillons();

/* ═══════════════════════════════════
   PAGE CATALOGUE
═══════════════════════════════════ */

async function initPageCatalogue() {
  const { initCatalogue, initFiltresCatalogue, initApparitions } = await import('./modules/catalogue.js');

  const conteneur = document.getElementById('catalogue-grille');
  if (conteneur) {
    initCatalogue(conteneur, 'full');
    initFiltresCatalogue();
  }

  initApparitions();

  // Filtres sidebar
  const filtresBtns = document.querySelectorAll('.filtre-item');
  filtresBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtresBtns.forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      document.dispatchEvent(new CustomEvent('filtre:categorie', { detail: btn.dataset.filtreCat }));
    });
  });
}

/* ═══════════════════════════════════
   PAGE DEVIS
═══════════════════════════════════ */

async function initPageDevis() {
  const [
    { Devis, formatPrix },
    { initRecapitulatif },
    { initCatalogue, initFiltresCatalogue },
    { ouvrirConfig },
    { sauvegarderBrouillon },
    { exporterPDF },
  ] = await Promise.all([
    import('./models/devis.js'),
    import('./modules/recapitulatif.js'),
    import('./modules/catalogue.js'),
    import('./modules/configurateur.js'),
    import('./modules/brouillons.js'),
    import('./modules/export-pdf.js'),
  ]);

  // ─── Récupérer ou créer le devis actif ───
  let devis = Devis.chargerSession() || new Devis();

  // ─── Récap sidebar ───────────────────────
  initRecapitulatif(devis);

  // Nom devis éditable dans la sidebar
  const inputNom = document.getElementById('recap-nom-devis');
  if (inputNom) {
    inputNom.value = devis.meta.nom;
    inputNom.addEventListener('input',  () => devis.mettreAJourMeta('nom', inputNom.value));
    inputNom.addEventListener('change', () => devis.sauvegarderSession());
  }

  // ─── Formulaire infos ────────────────────
  const champDirection = document.getElementById('champ-direction');
  const champContact   = document.getElementById('champ-contact');
  const champNotes     = document.getElementById('champ-notes');

  if (champDirection) {
    champDirection.value = devis.meta.direction;
    champDirection.addEventListener('input', () => devis.mettreAJourMeta('direction', champDirection.value));
  }
  if (champContact) {
    champContact.value = devis.meta.contact;
    champContact.addEventListener('input', () => devis.mettreAJourMeta('contact', champContact.value));
  }
  if (champNotes) {
    champNotes.value = devis.meta.notes;
    champNotes.addEventListener('input', () => devis.mettreAJourMeta('notes', champNotes.value));
  }

  // ─── Catalogue compact ───────────────────
  const conteneurCat = document.getElementById('catalogue-compact-zone');
  if (conteneurCat) {
    initCatalogue(conteneurCat, 'compact', (service) => {
      ouvrirConfig(service, devis);
    });
  }

  // Filtres rapides
  const filtresRapides = document.querySelectorAll('.filtre-rapide');
  filtresRapides.forEach(btn => {
    btn.addEventListener('click', () => {
      filtresRapides.forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      document.dispatchEvent(new CustomEvent('filtre:categorie', { detail: btn.dataset.filtreCat }));
    });
  });

  // Recherche dans le catalogue compact
  const rechercheDevis = document.getElementById('recherche-devis');
  if (rechercheDevis) {
    rechercheDevis.addEventListener('input', () => {
      // On ré-émet un event custom pour le module catalogue
      document.dispatchEvent(new CustomEvent('filtre:texte', { detail: rechercheDevis.value }));
    });
  }

  // ─── Sauvegarde automatique à chaque modification ───
  document.addEventListener('devis:updated', (e) => {
    e.detail.sauvegarderSession();
  });

  // ─── Bouton sauvegarder ──────────────────
  document.getElementById('btn-sauvegarder')?.addEventListener('click', () => {
    if (devis.isEmpty) return;
    if (!devis.meta.nom) {
      const nom = prompt('Donnez un nom à ce devis :');
      if (!nom) return;
      devis.mettreAJourMeta('nom', nom);
      if (inputNom) inputNom.value = nom;
    }
    sauvegarderBrouillon(devis);
    afficherToast('Brouillon sauvegardé.', 'succes');
  });

  // ─── Bouton export PDF ───────────────────
  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    if (devis.isEmpty) return;
    exporterPDF(devis);
  });

  // ─── Bouton nouveau devis ────────────────
  document.getElementById('btn-nouveau-devis')?.addEventListener('click', () => {
    if (!devis.isEmpty) {
      if (!confirm('Démarrer un nouveau devis ? Le devis actuel sera perdu si non sauvegardé.')) return;
    }
    Devis.effacerSession();
    devis = new Devis();
    initRecapitulatif(devis);
    if (inputNom)       inputNom.value        = '';
    if (champDirection) champDirection.value  = '';
    if (champContact)   champContact.value    = '';
    if (champNotes)     champNotes.value      = '';
    document.dispatchEvent(new CustomEvent('devis:updated', { detail: devis }));
  });

  // ─── Pré-sélection depuis le catalogue ───
  const serviceIdPreselect = Devis.getServicePreselect();
  if (serviceIdPreselect) {
    const { CATALOGUE } = await import('./data/catalogue.js');
    const service = CATALOGUE.find(s => s.id === serviceIdPreselect);
    if (service) {
      setTimeout(() => ouvrirConfig(service, devis), 200);
    }
  }
}

/* ═══════════════════════════════════
   PAGE BROUILLONS
═══════════════════════════════════ */

async function initPageBrouillons() {
  const [
    { Devis },
    { listerBrouillons, supprimerBrouillon, dupliquerBrouillon },
    { formatPrix },
  ] = await Promise.all([
    import('./models/devis.js'),
    import('./modules/brouillons.js'),
    import('./data/catalogue.js'),
  ]);

  const tbody    = document.getElementById('brouillons-tbody');
  const compteur = document.getElementById('brouillons-compteur');

  function render() {
    const liste = listerBrouillons();
    const n     = liste.length;

    if (compteur) compteur.textContent = `${n} brouillon${n > 1 ? 's' : ''}`;

    if (!tbody) return;

    if (n === 0) {
      document.getElementById('tableau-zone').hidden  = true;
      document.getElementById('etat-vide-zone').hidden = false;
      return;
    }

    document.getElementById('tableau-zone').hidden  = false;
    document.getElementById('etat-vide-zone').hidden = true;

    tbody.innerHTML = liste.map(b => {
      const d     = Devis.fromJSON(b);
      const date  = new Date(b.meta.dateModification).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
      const htStr = formatPrix(b.totaux?.htTotal || 0);
      const lignesN = (b.lignes || []).length;

      return `<tr data-id="${b.id}">
        <td class="col-nom">
          ${escHtml(b.meta.nom || 'Sans titre')}
        </td>
        <td>${escHtml(b.meta.direction || '—')}</td>
        <td class="col-date">${date}</td>
        <td class="col-montant">${htStr} <span style="font-weight:300;font-size:0.75rem;color:var(--sur-surface-secondaire)">HT</span></td>
        <td><span class="statut statut-${b.meta.statut}">${b.meta.statut}</span></td>
        <td>
          <div class="col-actions">
            <button class="btn-primaire" style="font-size:0.8rem;padding:0.4rem 0.875rem" data-action="reprendre" data-id="${b.id}">Reprendre</button>
            <button class="btn-secondaire" style="font-size:0.8rem;padding:0.4rem 0.875rem" data-action="dupliquer" data-id="${b.id}">Dupliquer</button>
            <button class="btn-danger" data-action="supprimer" data-id="${b.id}" title="Supprimer">✕</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    // Événements
    tbody.querySelectorAll('[data-action="reprendre"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = Devis.fromJSON(listerBrouillons().find(b => b.id === btn.dataset.id));
        if (d) { d.sauvegarderSession(); window.location.href = 'devis.html'; }
      });
    });

    tbody.querySelectorAll('[data-action="dupliquer"]').forEach(btn => {
      btn.addEventListener('click', () => {
        dupliquerBrouillon(btn.dataset.id);
        render();
        afficherToast('Brouillon dupliqué.', 'succes');
      });
    });

    tbody.querySelectorAll('[data-action="supprimer"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nom = listerBrouillons().find(b => b.id === btn.dataset.id)?.meta?.nom || 'ce brouillon';
        if (confirm(`Supprimer « ${nom} » ? Cette action est irréversible.`)) {
          supprimerBrouillon(btn.dataset.id);
          render();
          afficherToast('Brouillon supprimé.', '');
        }
      });
    });
  }

  render();

  document.getElementById('btn-nouveau-devis-brouillons')?.addEventListener('click', () => {
    Devis.effacerSession();
    window.location.href = 'devis.html';
  });
}

/* ─── Toast global ────────────────── */

function afficherToast(message, type = '') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className   = `toast${type ? ' toast-' + type : ''}`;
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => toast.classList.remove('visible'), 3200);
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
