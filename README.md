# AppStats

App Android + iOS di **statistiche calcistiche**, analisi e **previsioni 1X2** derivate dalle quote bookmaker. Solo API gratuite in v1.

**P1:** Home e Classifica da [football-data.org](https://www.football-data.org/) (Serie A + Premier).  
**P1b:** Database storico SQLite (solo partite finite) — CSV co.uk + API opzionali.

## Requisiti

- Node.js 20+ (consigliato LTS)
- [Expo Go](https://expo.dev/go) sul telefono, oppure emulatore Android / simulatore iOS

## Avvio locale

```bash
git fetch origin
git checkout cursor/p1-fixtures-standings-de3a   # o il branch della PR attiva
git pull
npm install
cp .env.example .env
# metti EXPO_PUBLIC_FOOTBALL_DATA_TOKEN=… (gratis)
npx expo start
```

Poi: QR con Expo Go, oppure `a` / `i` / `w`.

| Comando | Cosa fa |
| --- | --- |
| `npx expo start` | Dev server |
| `npx tsc --noEmit` | Typecheck |
| `npm run history:ingest` | Riempie `data/history.sqlite` (Windows: `node scripts\history\ingest.mjs`) |
| `npm run history:pack` | Copia il DB in `assets/databases/` (gitignored) |

### Storico

L’app include già ~3800 risultati Serie A + Premier (`assets/history/seed.json`).  
Utenti Windows: `git checkout` + `npx expo start` — **nessun ingest**.

Solo i maintainer aggiornano il seed:

```bat
node scripts\history\ingest.mjs
node scripts\history\export-seed.mjs
```

## Variabili d’ambiente

| Variabile | Uso |
| --- | --- |
| `EXPO_PUBLIC_FOOTBALL_DATA_TOKEN` | Calendario, risultati, classifiche (**richiesto per P1**) |
| `EXPO_PUBLIC_API_FOOTBALL_API_KEY` | Stats profonde (P2+) |
| `EXPO_PUBLIC_ODDS_API_KEY` | Quote 1X2 (P4) |

Token gratis: https://www.football-data.org/client/register  

Senza token l’app **non inventa** i risultati: mostra dove registrarsi.

**Non committare `.env`.**

## API gratuite

1. [football-data.org](https://www.football-data.org/client/register) — calendario/classifiche (~10 req/min)
2. [API-Football](https://www.api-football.com/) — profondità stats
3. [The Odds API](https://the-odds-api.com/#get-access) — quote

## Struttura

```
app/                 # Expo Router
src/domain/          # Match, Team, Standing, MarketOdds
src/data/adapters/   # football-data (P1 live), api-football, odds-api
src/data/repositories/
src/features/
src/ui/
```

## Disclaimer

Informazioni sportive e lettura delle quote. **Non** è consulenza sulle scommesse.
