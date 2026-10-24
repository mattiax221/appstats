# Roadmap AppStats

Piano delle fasi, in italiano. Ogni fase lascia l’app usabile.

| Fase | Titolo | Cosa ottieni | Stato |
| --- | --- | --- | --- |
| **P0** | Base app | Navigazione, tema matchday, schermate principali | **Fatto** |
| **P1** | Partite e classifiche | Calendario, risultati e tabelle (football-data.org) | **Fatto** |
| **P1b** | Database storico | SQLite locale: risultati passati, forma, gol HT (no live) | **Fatto** |
| **P2** | Statistiche profonde | Schede squadra, forma, H2H, stats match | **Prossimo** |
| **P3** | Preferiti | Segui squadre/leghe; Home più personale | In piano |
| **P4** | Previsioni da quote | 1X2 dal mercato bookmaker, consenso e value | In piano |
| **P5** | Rifinitura | Live best-effort, player stats, qualità complessiva | In piano |

## Database storico (P1b)

Archivio **solo partite finite** (niente live). Fonti gratuite combinate:

1. **football-data.co.uk** CSV — backfill massivo, nessuna chiave  
2. **football-data.org** — recenti, token in `.env` (`EXPO_PUBLIC_FOOTBALL_DATA_TOKEN`)  
3. **API-Football** — solo se c’è la chiave; batch piccolo  

### Windows

```bat
node scripts\history\ingest.mjs
node scripts\history\pack-for-app.mjs
npx expo start
```

In app: **Home → Storico** oppure **Impostazioni → Storico**.  
Se il DB è vuoto, puoi anche toccare **Importa CSV nell’app** (stesso CSV gratis).

Non committare `data/history.sqlite` né chiavi API.
