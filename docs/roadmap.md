# Roadmap AppStats

Piano delle fasi, in italiano. Ogni fase lascia l’app usabile.

| Fase | Titolo | Cosa ottieni | Stato |
| --- | --- | --- | --- |
| **P0** | Base app | Navigazione, tema matchday, schermate principali | **Fatto** |
| **P1** | Partite e classifiche | Calendario, risultati e tabelle (football-data.org) | **Fatto** |
| **P1b** | Database storico | Seed bundlato (~3800 SA+PL); Storico subito | **Fatto** |
| **P2** | Statistiche profonde | Schede squadra, forma, H2H, stats match | **Fatto** |
| **P3** | Preferiti | Segui squadre/leghe sul device; Home filtrata | **Fatto** |
| **P4** | Previsioni dallo storico | 1X2 stima da form/H2H; quote bookmaker solo con chiave | **Fatto** |
| **P5** | Rifinitura | Live best-effort, player stats, qualità complessiva | **Prossimo** |

## Seed storico (ogni install)

`assets/history/seed.json` è nel repo. Utenti Windows:

```bat
git checkout <branch>
npx expo start
```

Nessun ingest, nessun CSV, nessun token per vedere lo storico.

Maintainer (aggiornare il seed):

```bat
node scripts\history\ingest.mjs
node scripts\history\export-seed.mjs
```

## Previsioni (P4)

- Sempre: probabilità 1X2 **stima dallo storico** (forma + H2H).  
- Se `EXPO_PUBLIC_ODDS_API_KEY`: anche quote decimali e value vs stima.  
- Senza chiave: niente quote inventate.  
- Disclaimer: non è consulenza sulle scommesse.
