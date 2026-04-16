import { formatPrix } from '../models/devis.js';
import { CATEGORIES } from '../data/catalogue.js';

/**
 * Export PDF via window.print()
 * Génère un DOM #zone-impression injecté dans le body,
 * déclenche l'impression, puis nettoie.
 */

export function exporterPDF(devis) {
  if (devis.isEmpty) return;

  // Injecter la zone d'impression
  let zone = document.getElementById('zone-impression');
  if (zone) zone.remove();
  zone = document.createElement('div');
  zone.id = 'zone-impression';
  zone.innerHTML = construireHTML(devis);
  document.body.appendChild(zone);

  // Déclencher l'impression
  requestAnimationFrame(() => {
    window.print();
    // Nettoyer après impression (délai pour laisser le navigateur traiter)
    setTimeout(() => zone.remove(), 500);
  });
}

function construireHTML(devis) {
  const now   = new Date();
  const dateF = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const refId = devis.id.slice(-8).toUpperCase();

  const lignesHtml = devis.lignes.map((l, i) => {
    const catLabel = CATEGORIES[l.categorie]?.label || l.categorie;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>
          <strong>${escHtml(l.label)}</strong><br>
          <span style="font-size:9pt;color:#44474e">${escHtml(catLabel)} — ${escHtml(l.tarifLabel)}</span>
          ${l.configValues.participants ? `<br><span style="font-size:9pt;color:#44474e">${l.configValues.participants} participants</span>` : ''}
          ${l.configValues.format ? `<br><span style="font-size:9pt;color:#44474e">Format : ${escHtml(l.configValues.format)}</span>` : ''}
        </td>
        <td class="col-prix">${formatPrix(l.prixUnitaire)}</td>
        <td style="text-align:center">${l.quantite}</td>
        <td class="col-prix">${formatPrix(l.sousTotal)}</td>
      </tr>`;
  }).join('');

  const notesHtml = devis.meta.notes
    ? `<div class="print-notes">
        <h4>Notes & conditions particulières</h4>
        <p>${escHtml(devis.meta.notes)}</p>
      </div>`
    : '';

  return `
    <div class="print-entete">
      <div class="print-logo-zone">
        <div class="print-outil-nom">SPECTRUM</div>
        <div class="print-fan-label">Fabrique de l'Adoption Numérique — e.SNCF Solutions</div>
      </div>
      <div class="print-date">
        <div>Devis n° ${refId}</div>
        <div style="margin-top:0.25rem">Émis le ${dateF}</div>
      </div>
    </div>

    <div class="print-infos">
      <div class="print-info-bloc">
        <h4>Intitulé du devis</h4>
        <p>${escHtml(devis.meta.nom || 'Sans titre')}</p>
      </div>
      <div class="print-info-bloc">
        <h4>Direction / Entité</h4>
        <p>${escHtml(devis.meta.direction || '—')}</p>
      </div>
      <div class="print-info-bloc">
        <h4>Contact</h4>
        <p>${escHtml(devis.meta.contact || '—')}</p>
      </div>
    </div>

    <table class="print-tableau">
      <thead>
        <tr>
          <th style="width:4%">#</th>
          <th style="width:52%">Prestation</th>
          <th style="width:16%;text-align:right">Prix unitaire HT</th>
          <th style="width:8%;text-align:center">Qté</th>
          <th style="width:20%;text-align:right">Sous-total HT</th>
        </tr>
      </thead>
      <tbody>${lignesHtml}</tbody>
    </table>

    <table class="print-totaux">
      <tbody>
        <tr>
          <td>Total HT</td>
          <td>${formatPrix(devis.totaux.htTotal)}</td>
        </tr>
        <tr>
          <td>TVA (20 %)</td>
          <td>${formatPrix(devis.totaux.tvaTotal)}</td>
        </tr>
        <tr class="ligne-ttc">
          <td>Total TTC</td>
          <td>${formatPrix(devis.totaux.ttcTotal)}</td>
        </tr>
      </tbody>
    </table>

    ${notesHtml}

    <div class="print-pied">
      Fabrique de l'Adoption Numérique — e.SNCF Solutions — Devis établi via SPECTRUM — ${dateF}
    </div>
  `;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
