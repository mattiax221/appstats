# AppStats

App Android + iOS di **statistiche calcistiche**, analisi e **previsioni 1X2** derivate dalle quote bookmaker. Solo API gratuite in v1.

Questo repository è allo **scaffold P0**: Expo Router (tab + stack), TanStack Query, tipi di dominio, adapter/repository stub, shell UI in italiano.

## Requisiti

- Node.js 20+ (consigliato LTS)
- [Expo Go](https://expo.dev/go) sul telefono, oppure emulatore Android / simulatore iOS

## Avvio locale

```bash
npm install
cp .env.example .env   # opzionale in P0 — le chiavi servono da P1 in poi
npx expo start
```

Poi:

- scansiona il QR con Expo Go, oppure
- premi `a` (Android), `i` (iOS), `w` (web)

Script utili:

| Comando | Cosa fa |
| --- | --- |
| `npm start` / `npx expo start` | Dev server Metro |
| `npm run android` | Expo + Android |
| `npm run ios` | Expo + iOS (macOS) |
| `npm run web` | Anteprima web |
| `npx tsc --noEmit` | Typecheck |

## Variabili d’ambiente

Copia `.env.example` in `.env`. Expo espone solo chiavi con prefisso `EXPO_PUBLIC_`.

| Variabile | Uso |
| --- | --- |
| `EXPO_PUBLIC_FOOTBALL_DATA_API_KEY` | Calendario, risultati, classifiche |
| `EXPO_PUBLIC_API_FOOTBALL_API_KEY` | Stats/eventi/lineup on-demand |
| `EXPO_PUBLIC_ODDS_API_KEY` | Quote 1X2 (previsioni) |

**Non committare `.env` né chiavi reali.** In v1 le chiavi nel client sono accettabili per prototipo; in seguito andrà un proxy/BFF.

## API gratuite (signup)

1. [football-data.org](https://www.football-data.org/client/register) — scheletro calendario/classifiche (~10 req/min free)
2. [API-Football](https://www.api-football.com/) — profondità stats (~100 req/giorno free tipico)
3. [The Odds API](https://the-odds-api.com/#get-access) — quote bookmaker (~500 req/mese free)

## Struttura

```
app/                      # Expo Router (tabs + match/team stack)
src/
  config/                 # env, TTL cache
  domain/                 # Match, Team, Standing, MarketOdds
  data/adapters/          # football-data, api-football, odds-api (stub)
  data/repositories/      # accesso tipizzato verso gli adapter
  features/               # schermate per area
  providers/              # TanStack Query
  ui/                     # tema e shell
```

Tab: **Home**, **Previsioni**, **Preferiti**, **Impostazioni**. Stack: `match/[id]`, `team/[id]` (placeholder).

## Disclaimer

AppStats fornisce informazioni sportive e una lettura delle quote di mercato. **Non** è consulenza sulle scommesse. Le previsioni v1 saranno probabilità implicite dai bookmaker, non un modello ML proprietario.
