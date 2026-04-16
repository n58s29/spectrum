import { formatPrix } from '../data/catalogue.js';

const TVA = 0.20;
const CLE_SESSION   = 'spectrum_devis_actif';
const CLE_PRESELECT = 'spectrum_service_preselect';

/**
 * Modèle de données d'un devis SPECTRUM
 * Émet un CustomEvent 'devis:updated' sur document à chaque modification
 */
export class Devis {
  constructor(data = {}) {
    this.id      = data.id      || Devis._genId();
    this.version = data.version || 1;
    this.meta    = {
      nom:              data.meta?.nom              || '',
      direction:        data.meta?.direction        || '',
      contact:          data.meta?.contact          || '',
      dateCreation:     data.meta?.dateCreation     || new Date().toISOString(),
      dateModification: data.meta?.dateModification || new Date().toISOString(),
      statut:           data.meta?.statut           || 'brouillon',
      notes:            data.meta?.notes            || '',
    };
    this.lignes = (data.lignes || []).map(l => ({ ...l }));
    this._calculerTotaux();
  }

  /* ─── Identification ─────────────── */

  static _genId() {
    return 'devis-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  /* ─── Lignes ─────────────────────── */

  ajouterLigne(service, tarifChoisi, configValues = {}) {
    const ligne = {
      id:           'ligne-' + Date.now(),
      serviceId:    service.id,
      label:        service.nom,
      categorie:    service.categorie,
      couleur:      service.categorie, // mapped via CSS
      tarifLabel:   tarifChoisi.label,
      configValues: { ...configValues },
      prixUnitaire: tarifChoisi.prix,
      quantite:     configValues.quantite || 1,
      sousTotal:    tarifChoisi.prix * (configValues.quantite || 1),
    };
    this.lignes.push(ligne);
    this._notifier();
    return ligne;
  }

  supprimerLigne(ligneId) {
    this.lignes = this.lignes.filter(l => l.id !== ligneId);
    this._notifier();
  }

  mettreAJourMeta(champ, valeur) {
    this.meta[champ] = valeur;
    this._notifier();
  }

  finaliser() {
    this.meta.statut = 'finalisé';
    this._notifier();
  }

  /* ─── Calculs ────────────────────── */

  _calculerTotaux() {
    const htTotal  = this.lignes.reduce((s, l) => s + l.sousTotal, 0);
    const tvaTotal = htTotal * TVA;
    this.totaux = {
      htTotal,
      tauxTva:  TVA,
      tvaTotal,
      ttcTotal: htTotal + tvaTotal,
    };
  }

  get isEmpty() { return this.lignes.length === 0; }

  /* ─── Événement ──────────────────── */

  _notifier() {
    this.meta.dateModification = new Date().toISOString();
    this._calculerTotaux();
    document.dispatchEvent(new CustomEvent('devis:updated', { detail: this, bubbles: false }));
  }

  /* ─── Sérialisation ──────────────── */

  toJSON() {
    return {
      id:      this.id,
      version: this.version,
      meta:    { ...this.meta },
      lignes:  this.lignes.map(l => ({ ...l, configValues: { ...l.configValues } })),
      totaux:  { ...this.totaux },
    };
  }

  static fromJSON(data) {
    return new Devis(data);
  }

  /* ─── Persistance sessionStorage ─── */

  sauvegarderSession() {
    sessionStorage.setItem(CLE_SESSION, JSON.stringify(this.toJSON()));
  }

  static chargerSession() {
    const raw = sessionStorage.getItem(CLE_SESSION);
    if (!raw) return null;
    try {
      return Devis.fromJSON(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  static effacerSession() {
    sessionStorage.removeItem(CLE_SESSION);
  }

  static getServicePreselect() {
    const id = sessionStorage.getItem(CLE_PRESELECT);
    sessionStorage.removeItem(CLE_PRESELECT);
    return id;
  }

  static setServicePreselect(serviceId) {
    sessionStorage.setItem(CLE_PRESELECT, serviceId);
  }

  /* ─── Description lisible d'une ligne ─── */

  static descriptionLigne(ligne) {
    const parts = [ligne.tarifLabel];
    const cv = ligne.configValues;
    if (cv.participants) parts.push(`${cv.participants} participants`);
    if (cv.format)       parts.push(cv.format);
    if (cv.niveau)       parts.push(cv.niveau);
    if (cv.techno)       parts.push(cv.techno);
    if (cv.quantite && cv.quantite > 1) parts.push(`×${cv.quantite}`);
    return parts.join(' · ');
  }
}

/* ─── Formatage ─────────────────────── */

export { formatPrix, TVA };
