import { Devis } from '../models/devis.js';

const CLE_STORAGE = 'spectrum_brouillons';

/**
 * CRUD brouillons via localStorage
 */

export function listerBrouillons() {
  try {
    const raw = localStorage.getItem(CLE_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function sauvegarderBrouillon(devis) {
  const liste = listerBrouillons();
  const idx   = liste.findIndex(b => b.id === devis.id);
  const data  = devis.toJSON();
  if (idx >= 0) {
    liste[idx] = data;
  } else {
    liste.unshift(data);          // plus récent en tête
  }
  localStorage.setItem(CLE_STORAGE, JSON.stringify(liste));
}

export function chargerBrouillon(id) {
  const liste = listerBrouillons();
  const data  = liste.find(b => b.id === id);
  return data ? Devis.fromJSON(data) : null;
}

export function supprimerBrouillon(id) {
  const liste = listerBrouillons().filter(b => b.id !== id);
  localStorage.setItem(CLE_STORAGE, JSON.stringify(liste));
}

export function dupliquerBrouillon(id) {
  const original = chargerBrouillon(id);
  if (!original) return null;
  const copie = Devis.fromJSON({
    ...original.toJSON(),
    id:   'devis-' + Date.now() + '-copy',
    meta: {
      ...original.meta,
      nom:              'Copie — ' + original.meta.nom,
      dateCreation:     new Date().toISOString(),
      dateModification: new Date().toISOString(),
      statut:           'brouillon',
    },
  });
  sauvegarderBrouillon(copie);
  return copie;
}
