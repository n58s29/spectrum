/**
 * Catalogue des prestations FAN
 * Source de vérité statique — tarifs HT en euros
 */

export const CATEGORIES = {
  espaces:         { label: 'Location d\'espaces',      couleur: 'cerulean', icone: '🏢' },
  genai:           { label: 'Ateliers IA Générative',   couleur: 'lavande',  icone: '✦'  },
  experimentation: { label: 'Projets expérimentaux',    couleur: 'menthe',   icone: '⬡'  },
  innovation:      { label: 'Open Innovation',          couleur: 'ambre',    icone: '◈'  },
};

export const CATALOGUE = [

  /* ───────────────────────────────
     LOCATION D'ESPACES
  ─────────────────────────────── */
  {
    id: 'esp-salle-reunion',
    categorie: 'espaces',
    nom: 'Salle de réunion 574',
    description: 'Salle de travail au cœur de l\'accélérateur e.SNCF. Équipée d\'un écran interactif 85", d\'un système de visioconférence Poly et d\'un tableau blanc digital. Idéale pour vos points projet, revues de sprint ou ateliers restreints.',
    capacite: '2 à 20 personnes',
    tarifs: [
      { valeur: 'demi-journee', label: 'Demi-journée (4h)', prix: 250 },
      { valeur: 'journee',      label: 'Journée complète (8h)', prix: 450 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 2, max: 20, defaut: 10 },
      equipements: {
        label: 'Équipements optionnels', type: 'checkboxes',
        options: [
          { valeur: 'visco', label: 'Visioconférence' },
          { valeur: 'post-it', label: 'Kit atelier (post-it, feutres)' },
          { valeur: 'catering', label: 'Service café & viennoiseries' },
        ]
      },
    },
    tags: ['réunion', 'brainstorming', 'hybride', 'visio'],
  },

  {
    id: 'esp-grande-salle',
    categorie: 'espaces',
    nom: 'Grande salle événementielle',
    description: 'Espace modulable pour vos événements d\'ampleur : séminaires, conférences, remises de prix, kick-off de programme. Scène, sono professionnelle et système d\'éclairage pilotable. Accueil sur mesure possible.',
    capacite: '30 à 150 personnes',
    tarifs: [
      { valeur: 'demi-journee', label: 'Demi-journée (4h)', prix: 900 },
      { valeur: 'journee',      label: 'Journée complète (8h)', prix: 1600 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 30, max: 150, defaut: 60 },
      format: {
        label: 'Configuration de l\'espace', type: 'radio',
        options: [
          { valeur: 'theatre', label: 'Théâtre' },
          { valeur: 'ilots',   label: 'Îlots de travail' },
          { valeur: 'cocktail', label: 'Cocktail debout' },
        ]
      },
    },
    tags: ['événement', 'conférence', 'séminaire', 'kick-off'],
  },

  {
    id: 'esp-open-space',
    categorie: 'espaces',
    nom: 'Open space créatif',
    description: 'Espace ouvert et modulable pensé pour la collaboration intensive. Mobilier roulant reconfigurable en 5 minutes, murs scriptibles, matériel de prototypage (carton, plastique, outils). Le terrain de jeu des design sprints.',
    capacite: '8 à 35 personnes',
    tarifs: [
      { valeur: 'demi-journee', label: 'Demi-journée', prix: 400 },
      { valeur: 'journee',      label: 'Journée complète', prix: 700 },
      { valeur: 'pack-sprint',  label: 'Pack Sprint 5 jours', prix: 2800 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 8, max: 35, defaut: 16 },
      materiel: {
        label: 'Matériel inclus', type: 'checkboxes',
        options: [
          { valeur: 'proto', label: 'Kit prototypage' },
          { valeur: 'lego', label: 'LEGO Serious Play' },
          { valeur: 'facilitation', label: 'Kit facilitation visuelle' },
        ]
      },
    },
    tags: ['design sprint', 'créativité', 'collaboration', 'prototypage'],
  },

  {
    id: 'esp-studio',
    categorie: 'espaces',
    nom: 'Studio podcast & vidéo',
    description: 'Studio professionnel pour vos contenus de communication interne ou de formation. Fond vert chromakey, micro-cravate et table-ronde, éclairage RGB réglable, prise son isolée. Montage léger possible sur place (iMac dédié).',
    capacite: '1 à 5 personnes',
    tarifs: [
      { valeur: 'demi-journee', label: 'Demi-journée', prix: 220 },
      { valeur: 'journee',      label: 'Journée complète', prix: 380 },
    ],
    configOptions: {
      type_contenu: {
        label: 'Type de contenu', type: 'radio',
        options: [
          { valeur: 'podcast', label: 'Podcast audio' },
          { valeur: 'video',   label: 'Vidéo / interview' },
          { valeur: 'elearning', label: 'Module e-learning' },
        ]
      },
    },
    tags: ['podcast', 'vidéo', 'communication', 'e-learning'],
  },

  /* ───────────────────────────────
     ATELIERS IA GÉNÉRATIVE
  ─────────────────────────────── */
  {
    id: 'gen-sensibilisation',
    categorie: 'genai',
    nom: 'Sensibilisation à l\'IA Générative',
    description: 'Atelier de découverte pour vos équipes non techniques. Comprendre le fonctionnement des LLM, explorer les usages métier SNCF (rédaction, synthèse, analyse de données), premiers pas avec Copilot 365 et ChatGPT. Zéro prérequis.',
    capacite: '10 à 30 personnes',
    tarifs: [
      { valeur: '2h',     label: 'Session courte (2h)', prix: 1500 },
      { valeur: '4h',     label: 'Demi-journée (4h)',   prix: 2400 },
      { valeur: 'journee', label: 'Journée immersive',  prix: 4000 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 10, max: 30, defaut: 20 },
      format: {
        label: 'Format de l\'atelier', type: 'radio',
        options: [
          { valeur: 'presentiel',  label: 'Présentiel' },
          { valeur: 'distanciel',  label: 'Distanciel' },
          { valeur: 'hybride',     label: 'Hybride' },
        ]
      },
      niveau: {
        label: 'Public cible', type: 'radio',
        options: [
          { valeur: 'debutant',      label: 'Tous publics' },
          { valeur: 'intermediaire', label: 'Managers & cadres' },
        ]
      },
    },
    tags: ['GenAI', 'Copilot', 'sensibilisation', 'LLM', 'non-technique'],
  },

  {
    id: 'gen-prompt',
    categorie: 'genai',
    nom: 'Atelier Prompt Engineering',
    description: 'Maîtrisez l\'art du prompt pour transformer votre quotidien professionnel. Frameworks CARE, COAST et chain-of-thought, gestion du contexte, system prompts, exercices pratiques sur vos vrais cas métier SNCF.',
    capacite: '8 à 20 personnes',
    tarifs: [
      { valeur: 'journee',  label: 'Journée (fondamentaux)', prix: 3500 },
      { valeur: '2-jours',  label: '2 jours (expert)',       prix: 6500 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 8, max: 20, defaut: 14 },
      format: {
        label: 'Format', type: 'radio',
        options: [
          { valeur: 'presentiel', label: 'Présentiel' },
          { valeur: 'distanciel', label: 'Distanciel' },
        ]
      },
      niveau: {
        label: 'Niveau', type: 'radio',
        options: [
          { valeur: 'intermediaire', label: 'Utilisateurs Copilot' },
          { valeur: 'avance',        label: 'Développeurs / MOA' },
        ]
      },
    },
    tags: ['prompt engineering', 'Copilot', 'productivité', 'LLM'],
  },

  {
    id: 'gen-hackathon',
    categorie: 'genai',
    nom: 'Hackathon IA Générative',
    description: 'Format immersif compétitif pour concevoir et prototyper des usages IA en équipes. Accès aux APIs Azure OpenAI, accompagnement par 2 experts FAN, présentation jury le dernier jour. Le meilleur tremplin pour vos ambassadeurs GenAI.',
    capacite: '20 à 60 personnes (4 à 12 équipes)',
    tarifs: [
      { valeur: '1-jour',  label: '1 journée (format flash)', prix: 6500 },
      { valeur: '2-jours', label: '2 jours (standard)',        prix: 11000 },
      { valeur: '3-jours', label: '3 jours (approfondi)',      prix: 15500 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 20, max: 60, defaut: 32 },
    },
    tags: ['hackathon', 'prototype', 'équipes', 'Azure OpenAI', 'compétition'],
  },

  {
    id: 'gen-agents',
    categorie: 'genai',
    nom: 'Formation Agents IA & Automatisation',
    description: 'Concevez vos premiers agents IA et automatisations sans code (ou low-code). Copilot Studio, n8n, LangChain en Python. Création d\'un cas d\'usage réel de votre direction pendant la formation.',
    capacite: '6 à 15 personnes',
    tarifs: [
      { valeur: 'journee', label: 'Journée (bases)',     prix: 4500 },
      { valeur: '2-jours', label: '2 jours (complet)',   prix: 8000 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 6, max: 15, defaut: 10 },
      niveau: {
        label: 'Profil technique', type: 'radio',
        options: [
          { valeur: 'moa',     label: 'MOA / Product Owner' },
          { valeur: 'dev',     label: 'Développeur / Data' },
        ]
      },
    },
    tags: ['agents IA', 'automatisation', 'Copilot Studio', 'n8n', 'LangChain'],
  },

  /* ───────────────────────────────
     PROJETS EXPÉRIMENTAUX
  ─────────────────────────────── */
  {
    id: 'exp-sprint',
    categorie: 'experimentation',
    nom: 'Sprint de prototypage (5 jours)',
    description: 'Cinq jours d\'immersion pour passer d\'une idée à un prototype cliquable. Méthode Design Sprint adaptée au contexte SNCF, équipe FAN pluridisciplinaire (UX, dev, facilitateur), test utilisateurs le vendredi.',
    capacite: '4 à 8 personnes côté client',
    tarifs: [
      { valeur: 'standard',  label: 'Sprint standard (1 équipe)', prix: 9000 },
      { valeur: 'double',    label: 'Double sprint (2 pistes)',    prix: 16000 },
    ],
    configOptions: {
      theme: {
        label: 'Thématique du sprint', type: 'radio',
        options: [
          { valeur: 'ux',       label: 'Expérience voyageur' },
          { valeur: 'ops',      label: 'Opérations & maintenance' },
          { valeur: 'rh',       label: 'RH & collectif de travail' },
          { valeur: 'data',     label: 'Data & pilotage' },
          { valeur: 'autre',    label: 'Autre (préciser en notes)' },
        ]
      },
    },
    tags: ['Design Sprint', 'prototype', 'UX', 'innovation', '5 jours'],
  },

  {
    id: 'exp-poc',
    categorie: 'experimentation',
    nom: 'Proof of Concept technologique',
    description: 'Démonstration de faisabilité sur une technologie émergente pilotée par les experts FAN. Livrable : prototype fonctionnel, documentation technique, analyse de coût de passage à l\'échelle.',
    capacite: 'Équipe projet 2 à 5 personnes',
    tarifs: [
      { valeur: '4-semaines', label: '4 semaines (périmètre ciblé)', prix: 12000 },
      { valeur: '8-semaines', label: '8 semaines (approfondi)',       prix: 21000 },
    ],
    configOptions: {
      techno: {
        label: 'Technologie cible', type: 'radio',
        options: [
          { valeur: 'gen-ai',    label: 'IA Générative' },
          { valeur: 'vision',    label: 'Vision par ordinateur' },
          { valeur: 'predictif', label: 'Analyse prédictive' },
          { valeur: 'jumeaux',   label: 'Jumeaux numériques' },
          { valeur: 'iot',       label: 'IoT & capteurs' },
        ]
      },
    },
    tags: ['POC', 'faisabilité', 'R&D', 'technologie émergente'],
  },

  {
    id: 'exp-data',
    categorie: 'experimentation',
    nom: 'Tableau de bord analytique',
    description: 'Conception et déploiement d\'un dashboard opérationnel à partir de vos données métier. De la connexion aux sources à la mise en production. Transfert de compétences inclus pour votre équipe.',
    capacite: 'Équipe 2 à 4 personnes',
    tarifs: [
      { valeur: '3-semaines', label: '3 semaines (MVP)',     prix: 7500 },
      { valeur: '6-semaines', label: '6 semaines (complet)', prix: 13500 },
    ],
    configOptions: {
      outil: {
        label: 'Outil de dataviz', type: 'radio',
        options: [
          { valeur: 'powerbi',  label: 'Power BI' },
          { valeur: 'grafana',  label: 'Grafana' },
          { valeur: 'metabase', label: 'Metabase' },
          { valeur: 'custom',   label: 'Solution sur mesure' },
        ]
      },
    },
    tags: ['data', 'tableau de bord', 'Power BI', 'analytics'],
  },

  {
    id: 'exp-iot',
    categorie: 'experimentation',
    nom: 'Expérimentation IoT & Capteurs',
    description: 'Pilote IoT sur site ferroviaire ou administratif : déploiement de capteurs, agrégation temps réel, alertes et visualisation. Idéal pour la maintenance prédictive, la gestion de flux ou l\'efficacité énergétique.',
    capacite: 'Équipe technique 2 à 5 personnes',
    tarifs: [
      { valeur: '6-semaines',  label: '6 semaines (pilote)',           prix: 15000 },
      { valeur: '12-semaines', label: '12 semaines (déploiement site)', prix: 27000 },
    ],
    configOptions: {
      cas_usage: {
        label: 'Cas d\'usage', type: 'radio',
        options: [
          { valeur: 'maintenance', label: 'Maintenance prédictive' },
          { valeur: 'flux',        label: 'Gestion de flux' },
          { valeur: 'energie',     label: 'Efficacité énergétique' },
          { valeur: 'autre',       label: 'Autre' },
        ]
      },
    },
    tags: ['IoT', 'capteurs', 'maintenance prédictive', 'temps réel'],
  },

  /* ───────────────────────────────
     OPEN INNOVATION
  ─────────────────────────────── */
  {
    id: 'inno-analyse-startup',
    categorie: 'innovation',
    nom: 'Analyse de l\'écosystème startup',
    description: 'Cartographie des acteurs, tendances et opportunités de collaboration dans votre domaine. Méthodologie sourcing propriétaire FAN. Livrable : rapport de 25 pages + deck exécutif + base de données des startups identifiées.',
    capacite: 'Direction + équipe innovation',
    tarifs: [
      { valeur: 'france',  label: 'Périmètre France (400 startups)', prix: 5500 },
      { valeur: 'europe',  label: 'Europe (900 startups)',            prix: 9000 },
      { valeur: 'monde',   label: 'Mondial (1500+ startups)',         prix: 13500 },
    ],
    configOptions: {
      secteur: {
        label: 'Secteur d\'analyse', type: 'radio',
        options: [
          { valeur: 'mobilite',    label: 'Mobilité & transport' },
          { valeur: 'ia',         label: 'IA & données' },
          { valeur: 'greentech',  label: 'GreenTech & énergie' },
          { valeur: 'rh-future',  label: 'Futur du travail' },
          { valeur: 'cyber',      label: 'Cybersécurité' },
        ]
      },
    },
    tags: ['startups', 'veille', 'cartographie', 'open innovation'],
  },

  {
    id: 'inno-benchmark',
    categorie: 'innovation',
    nom: 'Benchmark technologique sectoriel',
    description: 'Analyse comparative des solutions et pratiques dans votre domaine. Matrice de positionnement, identification des best practices, recommandations stratégiques pour votre roadmap technologique.',
    capacite: 'Équipe stratégie',
    tarifs: [
      { valeur: '3-semaines', label: '3 semaines (ciblé)',  prix: 4200 },
      { valeur: '6-semaines', label: '6 semaines (étendu)', prix: 7500 },
    ],
    configOptions: {
      livrable: {
        label: 'Format du livrable', type: 'radio',
        options: [
          { valeur: 'rapport',     label: 'Rapport PDF + deck' },
          { valeur: 'atelier',     label: 'Rapport + atelier de restitution' },
          { valeur: 'interactif',  label: 'Dashboard interactif + rapport' },
        ]
      },
    },
    tags: ['benchmark', 'stratégie', 'roadmap', 'concurrence'],
  },

  {
    id: 'inno-cocreation',
    categorie: 'innovation',
    nom: 'Session de co-création',
    description: 'Atelier facilité de co-construction avec vos parties prenantes, partenaires et startups. Méthodes Design Thinking, idéation divergente / convergente, priorisation. Résultat : plan d\'action co-construit et priorisé.',
    capacite: '12 à 40 personnes',
    tarifs: [
      { valeur: '4h',     label: 'Demi-journée (4h)',   prix: 2600 },
      { valeur: 'journee', label: 'Journée complète',  prix: 4200 },
      { valeur: '2-jours', label: '2 jours (immersif)', prix: 7500 },
    ],
    configOptions: {
      participants: { label: 'Nombre de participants', type: 'range', min: 12, max: 40, defaut: 20 },
      methode: {
        label: 'Méthode principale', type: 'radio',
        options: [
          { valeur: 'design-thinking', label: 'Design Thinking' },
          { valeur: 'future-back',     label: 'Future Back' },
          { valeur: 'jobs-to-be-done', label: 'Jobs To Be Done' },
          { valeur: 'lean-startup',    label: 'Lean Startup' },
        ]
      },
    },
    tags: ['co-création', 'Design Thinking', 'facilitation', 'parties prenantes'],
  },

  {
    id: 'inno-veille',
    categorie: 'innovation',
    nom: 'Veille stratégique thématique',
    description: 'Abonnement à une veille technologique et sectorielle personnalisée. Synthèse mensuelle de 4 pages, alertes hebdomadaires ciblées, newsletter dédiée. Animée par les analystes FAN et notre réseau d\'experts.',
    capacite: 'Toute l\'équipe concernée',
    tarifs: [
      { valeur: '3-mois',  label: '3 mois',  prix: 3200 },
      { valeur: '6-mois',  label: '6 mois',  prix: 5800 },
      { valeur: '12-mois', label: '12 mois (tarif annuel)', prix: 10500 },
    ],
    configOptions: {
      frequence: {
        label: 'Fréquence des livrables', type: 'radio',
        options: [
          { valeur: 'hebdo',   label: 'Hebdomadaire (alertes + synthèse mensuelle)' },
          { valeur: 'mensuel', label: 'Mensuel (synthèse mensuelle)' },
        ]
      },
    },
    tags: ['veille', 'stratégie', 'newsletter', 'abonnement'],
  },
];

/**
 * Retourne le prix minimum du catalogue d'un service
 */
export function getPrixMin(service) {
  return Math.min(...service.tarifs.map(t => t.prix));
}

/**
 * Retourne le prix maximum du catalogue d'un service
 */
export function getPrixMax(service) {
  return Math.max(...service.tarifs.map(t => t.prix));
}

/**
 * Formate un prix en euros
 */
export function formatPrix(montant, options = {}) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(montant);
}
