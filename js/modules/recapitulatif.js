import { formatPrix, Devis } from '../models/devis.js';

/**
 * Rendu du panneau récapitulatif latéral (sidebar devis)
 * S'abonne à l'événement CustomEvent 'devis:updated'
 */

const COULEURS_CATEGORIE = {
  espaces:         'var(--cerulean)',
  genai:           'var(--lavande)',
  experimentation: 'var(--menthe)',
  innovation:      'var(--ambre)',
};

export function initRecapitulatif(devis) {
  document.addEventListener('devis:updated', (e) => {
    render(e.detail);
  });
  // Rendu initial
  render(devis);
}

function render(devis) {
  renderNom(devis);
  renderDirection(devis);
  renderLignes(devis);
  renderTotaux(devis);
  renderActions(devis);
}

function renderNom(devis) {
  const input = document.getElementById('recap-nom-devis');
  if (input && document.activeElement !== input) {
    input.value = devis.meta.nom;
  }
}

function renderDirection(devis) {
  const el = document.getElementById('recap-direction');
  if (el) {
    el.textContent = devis.meta.direction || 'Direction non renseignée';
  }
}

function renderLignes(devis) {
  const zone = document.getElementById('recap-lignes-zone');
  if (!zone) return;

  if (devis.isEmpty) {
    zone.innerHTML = `
      <div class="recap-vide">
        <span class="recap-vide-icone">◻</span>
        Aucune prestation sélectionnée.<br>Ajoutez des services ci-contre.
      </div>`;
    return;
  }

  const couleur = (cat) => COULEURS_CATEGORIE[cat] || 'var(--cerulean)';

  zone.innerHTML = `<ul class="recap-lignes">
    ${devis.lignes.map(l => `
      <li class="recap-ligne" data-id="${l.id}">
        <div class="recap-ligne-entete">
          <span class="recap-ligne-dot" style="background:${couleur(l.categorie)}"></span>
          <span class="recap-ligne-nom">${escHtml(l.label)}</span>
          <button class="recap-ligne-supprimer" data-id="${l.id}" title="Supprimer" aria-label="Supprimer ${escHtml(l.label)}">✕</button>
        </div>
        <div class="recap-ligne-detail">${escHtml(Devis.descriptionLigne(l))}</div>
        <div class="recap-ligne-prix">${formatPrix(l.sousTotal)}</div>
      </li>
    `).join('')}
  </ul>`;

  // Écouter les suppressions
  zone.querySelectorAll('.recap-ligne-supprimer').forEach(btn => {
    btn.addEventListener('click', () => {
      devis.supprimerLigne(btn.dataset.id);
    });
  });
}

function renderTotaux(devis) {
  const ht  = document.getElementById('recap-ht');
  const tva = document.getElementById('recap-tva');
  const ttc = document.getElementById('recap-ttc');
  if (ht)  ht.textContent  = formatPrix(devis.totaux.htTotal);
  if (tva) tva.textContent = formatPrix(devis.totaux.tvaTotal);
  if (ttc) ttc.textContent = formatPrix(devis.totaux.ttcTotal);
}

function renderActions(devis) {
  const btnExport = document.getElementById('btn-export-pdf');
  const btnSave   = document.getElementById('btn-sauvegarder');
  if (btnExport) btnExport.disabled = devis.isEmpty;
  if (btnSave)   btnSave.disabled   = devis.isEmpty;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
