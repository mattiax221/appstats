/** Normalize team display names across CSV / football-data.org / API-Football. */

const ALIASES = {
  // Premier
  'man united': 'Manchester United',
  'manchester utd': 'Manchester United',
  'man utd': 'Manchester United',
  'man city': 'Manchester City',
  'manchester city': 'Manchester City',
  'spurs': 'Tottenham',
  'tottenham hotspur': 'Tottenham',
  'tottenham': 'Tottenham',
  'wolves': 'Wolverhampton',
  'wolverhampton wanderers': 'Wolverhampton',
  'newcastle': 'Newcastle United',
  'newcastle utd': 'Newcastle United',
  'nottingham forest': "Nott'm Forest",
  "nott'm forest": "Nott'm Forest",
  'sheffield united': 'Sheffield Utd',
  'west ham': 'West Ham',
  'west ham united': 'West Ham',
  'brighton': 'Brighton',
  'brighton and hove albion': 'Brighton',
  'leicester': 'Leicester',
  'leicester city': 'Leicester',
  // Serie A
  'inter': 'Inter',
  'internazionale': 'Inter',
  'fc internazionale': 'Inter',
  'inter milan': 'Inter',
  'ac milan': 'Milan',
  'milan': 'Milan',
  'juventus': 'Juventus',
  'juve': 'Juventus',
  'as roma': 'Roma',
  'roma': 'Roma',
  'ss lazio': 'Lazio',
  'lazio': 'Lazio',
  'ssc napoli': 'Napoli',
  'napoli': 'Napoli',
  'atalanta bc': 'Atalanta',
  'atalanta': 'Atalanta',
  'acf fiorentina': 'Fiorentina',
  'fiorentina': 'Fiorentina',
  'torino fc': 'Torino',
  'torino': 'Torino',
  'genoa cfc': 'Genoa',
  'genoa': 'Genoa',
  'udinese calcio': 'Udinese',
  'udinese': 'Udinese',
  'hellas verona': 'Verona',
  'verona': 'Verona',
  'us sassuolo': 'Sassuolo',
  'sassuolo': 'Sassuolo',
  'bologna fc': 'Bologna',
  'bologna': 'Bologna',
  'cagliari calcio': 'Cagliari',
  'cagliari': 'Cagliari',
  'empoli': 'Empoli',
  'empoli fc': 'Empoli',
  'monza': 'Monza',
  'ac monza': 'Monza',
  'lecce': 'Lecce',
  'us lecce': 'Lecce',
  'salernitana': 'Salernitana',
  'us salernitana': 'Salernitana',
  'frosinone': 'Frosinone',
  'spezia': 'Spezia',
  'venezia': 'Venezia',
  'como': 'Como',
  'parma': 'Parma',
};

export function nameKey(raw) {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function canonicalName(raw) {
  const key = nameKey(raw);
  if (!key) return 'Unknown';
  return ALIASES[key] || titleCase(raw);
}

function titleCase(s) {
  return String(s)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}
