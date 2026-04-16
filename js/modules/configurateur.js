import { formatPrix } from '../models/devis.js';
import { CATEGORIES } from '../data/catalogue.js';

/**
 * Modal de configuration d'une prestation
 * Appel : ouvrirConfig(service, devis) → Promise<void>
 */

const COULEURS = {
  espaces:         'var(--cerulean)',
  genai:           'var(--lavande)',
  experimentation: 'var(--menthe)',
  innovation:      'var(--ambre)',
};

export function ouvrirConfig(service, devis) {
  const overlay = getOrCreateOverlay();
  overlay.innerHTML = '';
  overlay.appendChild(creerModal(service, devis));
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.champ-radio-btn:checked')?.closest('.champ-radio-label');
  overlay.querySelector('[data-first-radio]')?.focus();
}

function fermerModal() {
  const overlay = document.getElementById('modal-config-overlay');
  if (overlay) {
    overlay.hidden = true;
    overlay.innerHTML = '';
  }
  document.body.style.overflow = '';
}

function getOrCreateOverlay() {
  let overlay = document.getElementById('modal-config-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-config-overlay';
    overlay.className = 'modal-overlay';
    overlay.hidden = true;
    // Fermer en cliquant en dehors
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fermerModal();
    });
    document.body.appendChild(overlay);
  }
  return overlay;
}

function creerModal(service, devis) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-titre');

  const catLabel = CATEGORIES[service.categorie]?.label || service.categorie;
  const couleur  = COULEURS[service.categorie] || 'var(--cerulean)';

  modal.innerHTML = `
    <div class="modal-entete">
      <div style="display:flex;align-items:center;gap:0.5rem">
        <span class="badge badge-${service.categorie}">${catLabel}</span>
      </div>
      <h2 class="modal-titre" id="modal-titre">${escHtml(service.nom)}</h2>
      <p style="font-size:0.8125rem;font-weight:300;color:var(--sur-surface-secondaire);margin-top:0.5rem;line-height:1.5">
        ${escHtml(service.description)}
      </p>
    </div>

    <form id="form-config" novalidate>
      ${creerChampTarif(service, couleur)}
      ${creerChampsOptions(service)}
      ${creerChampQuantite()}
      ${creerChampNotes()}

      <div class="modal-prix-calcule">
        <div>
          <div class="modal-prix-label">Prix estimé</div>
          <div class="modal-prix-ht">Hors taxes</div>
        </div>
        <div>
          <div class="modal-prix-valeur" id="modal-prix-valeur">—</div>
        </div>
      </div>
    </form>

    <div class="modal-actions">
      <button type="button" class="btn-secondaire" id="btn-annuler-config">Annuler</button>
      <button type="button" class="btn-primaire" id="btn-confirmer-config">
        Ajouter au devis
      </button>
    </div>
  `;

  // Événements
  modal.querySelector('#btn-annuler-config').addEventListener('click', fermerModal);
  modal.querySelector('#btn-confirmer-config').addEventListener('click', () => {
    confirmerAjout(service, devis, modal);
  });

  // MAJ prix live
  modal.addEventListener('change', () => majPrix(service, modal));
  modal.addEventListener('input',  () => majPrix(service, modal));

  // Prix initial
  requestAnimationFrame(() => majPrix(service, modal));

  // ESC pour fermer
  const escHandler = (e) => { if (e.key === 'Escape') { fermerModal(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);

  return modal;
}

/* ─── Champs ───────────────────────── */

function creerChampTarif(service, couleur) {
  const options = service.tarifs.map((t, i) => `
    <input class="champ-radio-btn" type="radio" name="tarif" id="tarif-${t.valeur}" value="${t.valeur}" ${i === 0 ? 'checked' : ''}>
    <label class="champ-radio-label" for="tarif-${t.valeur}">${escHtml(t.label)} — <strong>${formatPrix(t.prix)}</strong></label>
  `).join('');

  return `
    <div class="champ-groupe" style="margin-bottom:1.25rem">
      <label class="champ-label">Formule tarifaire</label>
      <div class="champ-radio-groupe">${options}</div>
    </div>`;
}

function creerChampsOptions(service) {
  const opts = service.configOptions;
  if (!opts) return '';
  let html = '';

  for (const [cle, config] of Object.entries(opts)) {
    if (config.type === 'range') {
      html += `
        <div class="champ-groupe" style="margin-bottom:1.25rem">
          <label class="champ-label" for="opt-${cle}">
            ${escHtml(config.label)}
            <span id="opt-${cle}-valeur" style="font-weight:400;color:var(--primaire);margin-left:0.5rem">${config.defaut}</span>
          </label>
          <input type="range" class="champ-range" id="opt-${cle}" name="${cle}"
            min="${config.min}" max="${config.max}" value="${config.defaut}"
            style="margin-top:0.5rem">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--sur-surface-secondaire);margin-top:0.25rem">
            <span>${config.min}</span><span>${config.max}</span>
          </div>
        </div>`;
      // JS pour affichage live
    } else if (config.type === 'radio') {
      const radios = config.options.map((o, i) => `
        <input class="champ-radio-btn" type="radio" name="${cle}" id="opt-${cle}-${i}" value="${o.valeur}" ${i === 0 ? 'checked' : ''}>
        <label class="champ-radio-label" for="opt-${cle}-${i}">${escHtml(o.label)}</label>
      `).join('');
      html += `
        <div class="champ-groupe" style="margin-bottom:1.25rem">
          <label class="champ-label">${escHtml(config.label)}</label>
          <div class="champ-radio-groupe">${radios}</div>
        </div>`;
    } else if (config.type === 'checkboxes') {
      const cases = config.options.map((o, i) => `
        <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:300;cursor:pointer;padding:0.375rem 0">
          <input type="checkbox" name="${cle}" value="${o.valeur}" style="accent-color:var(--primaire)">
          ${escHtml(o.label)}
        </label>
      `).join('');
      html += `
        <div class="champ-groupe" style="margin-bottom:1.25rem">
          <label class="champ-label">${escHtml(config.label)}</label>
          ${cases}
        </div>`;
    }
  }
  return html;
}

function creerChampQuantite() {
  return `
    <div class="champ-groupe" style="margin-bottom:1.25rem">
      <label class="champ-label" for="opt-quantite">Quantité</label>
      <input type="number" class="champ" id="opt-quantite" name="quantite" min="1" max="99" value="1" style="width:100px">
    </div>`;
}

function creerChampNotes() {
  return `
    <div class="champ-sep"></div>
    <div class="champ-groupe" style="margin-bottom:0">
      <label class="champ-label" for="opt-notes">Notes (optionnel)</label>
      <textarea class="champ" id="opt-notes" name="notes" rows="2"
        placeholder="Précisez vos besoins particuliers…"
        style="resize:vertical;border-radius:0.25rem 0.25rem 0 0"></textarea>
    </div>`;
}

/* ─── Calcul prix live ─────────────── */

function majPrix(service, modal) {
  const form      = modal.querySelector('#form-config');
  const tarifVal  = form.querySelector('[name="tarif"]:checked')?.value;
  const quantite  = parseInt(form.querySelector('[name="quantite"]')?.value || '1', 10);
  const tarif     = service.tarifs.find(t => t.valeur === tarifVal) || service.tarifs[0];
  const total     = (tarif?.prix || 0) * (quantite || 1);

  const affichage = modal.querySelector('#modal-prix-valeur');
  if (affichage) affichage.textContent = formatPrix(total);

  // Mise à jour des range sliders
  modal.querySelectorAll('input[type="range"]').forEach(r => {
    const affEl = modal.querySelector(`#opt-${r.name}-valeur`);
    if (affEl) affEl.textContent = r.value;
  });
}

/* ─── Confirmation ajout ───────────── */

function confirmerAjout(service, devis, modal) {
  const form     = modal.querySelector('#form-config');
  const data     = new FormData(form);
  const tarifVal = data.get('tarif');
  const tarif    = service.tarifs.find(t => t.valeur === tarifVal) || service.tarifs[0];

  const configValues = {};
  for (const [k, v] of data.entries()) {
    if (k === 'tarif' || k === 'notes') continue;
    configValues[k] = v;
  }
  configValues.quantite = parseInt(data.get('quantite') || '1', 10);

  devis.ajouterLigne(service, tarif, configValues);
  fermerModal();
  afficherToast(`« ${service.nom} » ajouté au devis.`, 'succes');
}

/* ─── Toast ────────────────────────── */

function afficherToast(message, type = '') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className   = `toast toast-${type}`;
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => toast.classList.remove('visible'), 3000);
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
