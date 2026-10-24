# Roadmap AppStats

Piano delle fasi, in italiano. Ogni fase lascia l’app usabile.

| Fase | Titolo | Cosa ottieni | Stato |
| --- | --- | --- | --- |
| **P0** | Base app | Navigazione, tema matchday, schermate principali | **Fatto** |
| **P1** | Partite e classifiche | Calendario, risultati e tabelle (football-data.org) | **Fatto** |
| **P1b** | Database storico | Seed bundlato (~3800 SA+PL); Storico subito | **Fatto** |
| **P2** | Statistiche profonde | Schede squadra, forma, H2H, stats match | **Prossimo** |
| **P3** | Preferiti | Segui squadre/leghe; Home più personale | In piano |
| **P4** | Previsioni dallo storico | 1X2 stima da form/H2H; quote bookmaker solo con chiave | In piano |
| **P5** | Rifinitura | Live best-effort, player stats, qualità complessiva | In piano |

## Database storico (P1b)

L’installazione include `assets/history/seed.json` (partite finite Serie A + Premier).  
**Nessun ingest** per l’utente finale: `npx expo start` basta.

Maintainer (aggiornare il seed):

```bat
node scripts\history\ingest.mjs
node scripts\history\export-seed.mjs
```

In app: **Home → Storico**. Non committare `data/history.sqlite` né chiavi API.
