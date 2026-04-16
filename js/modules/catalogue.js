import { CATALOGUE, CATEGORIES, getPrixMin, getPrixMax, formatPrix } from '../data/catalogue.js';

/**
 * Rendu du catalogue de services
 * mode: 'full'    → index.html (grandes cartes avec description complète)
 * mode: 'compact' → devis.html (lignes compactes, bouton "Configurer")
 */

export function initCatalogue(conteneur, mode = 'full', onAjouter = null) {
  let filtreCategorie = 'tous';
  let filtreTexte     = '';

  function getServicesFiltrés() {
    return CATALOGUE.filter(s => {
      const matchCat  = filtreCategorie === 'tous' || s.categorie === filtreCategorie;
      const haystack  = (s.nom + ' ' + s.description + ' ' + s.tags.join(' ')).toLowerCase();
      const matchText = filtreTexte === '' || haystack.includes(filtreTexte.toLowerCase());
      return matchCat && matchText;
    });
  }

  function render() {
    const services = getServicesFiltrés();
    if (mode === 'full') renderFull(conteneur, services);
    if (mode === 'compact') renderCompact(conteneur, services, onAjouter);
    miseAJourCompteur(services.length);
  }

  // Écouter la recherche (index.html)
  const searchInput = document.getElementById('recherche-catalogue');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filtreTexte = searchInput.value.trim();
      render();
    });
  }

  // Écouter les filtres de catégorie
  document.addEventListener('filtre:categorie', (e) => {
    filtreCategorie = e.detail;
    render();
  });

  // Écouter la recherche textuelle (devis.html)
  document.addEventListener('filtre:texte', (e) => {
    filtreTexte = e.detail.trim();
    render();
  });

  // Rendu initial
  render();

  return {
    setCategorie: (cat) => { filtreCategorie = cat; render(); },
    setTexte:     (txt) => { filtreTexte = txt; render(); },
  };
}

/* ─── Rendu full (catalogue) ─────────── */

function renderFull(conteneur, services) {
  if (services.length === 0) {
    conteneur.innerHTML = `
      <div class="etat-vide">
        <span class="etat-vide-icone">◻</span>
        <div class="etat-vide-titre">Aucune prestation trouvée</div>
        <p class="etat-vide-texte">Modifiez vos critères de recherche ou de filtre.</p>
      </div>`;
    return;
  }

  conteneur.innerHTML = `<div class="grille-auto">
    ${services.map(s => carteServiceFull(s)).join('')}
  </div>`;

  conteneur.querySelectorAll('[data-action="demarrer-devis"]').forEach(btn => {
    btn.addEventListener('click', () => {
      import('../models/devis.js').then(({ Devis }) => {
        Devis.setServicePreselect(btn.dataset.serviceId);
        window.location.href = 'devis.html';
      });
    });
  });
}

function carteServiceFull(s) {
  const cat     = CATEGORIES[s.categorie];
  const prixMin = getPrixMin(s);
  const prixMax = getPrixMax(s);
  const prixAff = prixMin === prixMax ? formatPrix(prixMin) : `${formatPrix(prixMin)} – ${formatPrix(prixMax)}`;

  return `
    <article class="carte-service apparition" data-categorie="${s.categorie}">
      <div class="carte-service-accent" style="background:var(--${cat.couleur})"></div>
      <div class="carte-service-corps">
        <div class="carte-service-entete">
          <span class="badge badge-${s.categorie}">${cat.icone} ${escHtml(cat.label)}</span>
        </div>
        <h3 class="carte-service-nom">${escHtml(s.nom)}</h3>
        <p class="carte-service-description">${escHtml(s.description)}</p>
        <div class="carte-service-meta">
          <span class="carte-service-capacite">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style="opacity:.6">
              <circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M1 13c0-2.8 2.2-5 5-5h4c2.8 0 5 2.2 5 5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            ${escHtml(s.capacite)}
          </span>
          <div>
            <span class="carte-service-prix-plage">${prixAff} HT</span>
            <span class="carte-service-prix-unite"> / prestation</span>
          </div>
        </div>
        <div class="carte-service-tags">
          ${s.tags.slice(0, 3).map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}
        </div>
      </div>
      <div class="carte-service-pied">
        <button class="btn-primaire" style="flex:1" data-action="demarrer-devis" data-service-id="${s.id}">
          Démarrer un devis
        </button>
      </div>
    </article>`;
}

/* ─── Rendu compact (devis.html) ─────── */

function renderCompact(conteneur, services, onAjouter) {
  if (services.length === 0) {
    conteneur.innerHTML = `
      <div class="etat-vide" style="padding:2rem 1rem">
        <span class="etat-vide-icone">◻</span>
        <p class="etat-vide-texte">Aucune prestation correspond à votre recherche.</p>
      </div>`;
    return;
  }

  conteneur.innerHTML = `<div class="catalogue-compact">
    ${services.map(s => carteServiceCompacte(s)).join('')}
  </div>`;

  conteneur.querySelectorAll('[data-action="configurer-service"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = CATALOGUE.find(s => s.id === btn.dataset.serviceId);
      if (service && onAjouter) onAjouter(service);
    });
  });
}

function carteServiceCompacte(s) {
  const cat    = CATEGORIES[s.categorie];
  const prixMin = getPrixMin(s);

  return `
    <div class="carte-service-compacte" data-categorie="${s.categorie}">
      <span class="carte-compacte-dot" style="background:var(--${cat.couleur})"></span>
      <div class="carte-compacte-info">
        <div class="carte-compacte-nom">${escHtml(s.nom)}</div>
        <div class="carte-compacte-meta">${escHtml(cat.label)} · dès ${formatPrix(prixMin)} HT</div>
      </div>
      <button class="btn-primaire" style="font-size:0.8125rem;padding:0.5rem 1rem"
        data-action="configurer-service" data-service-id="${s.id}">
        + Configurer
      </button>
    </div>`;
}

/* ─── Compteur et filtres ─────────── */

function miseAJourCompteur(n) {
  const el = document.getElementById('catalogue-compteur');
  if (el) el.textContent = `${n} prestation${n > 1 ? 's' : ''}`;
}

export function initFiltresCatalogue() {
  const filtresBtns = document.querySelectorAll('[data-filtre-cat]');

  filtresBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtresBtns.forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      document.dispatchEvent(new CustomEvent('filtre:categorie', { detail: btn.dataset.filtreCat }));
    });
  });
}

/* ─── Apparitions au scroll ────────── */

export function initApparitions() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08 });

  document.querySelectorAll('.apparition').forEach(el => observer.observe(el));

  // Ré-observer après rendu dynamique
  document.addEventListener('catalogue:rendered', () => {
    document.querySelectorAll('.apparition:not(.visible)').forEach(el => observer.observe(el));
  });
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
