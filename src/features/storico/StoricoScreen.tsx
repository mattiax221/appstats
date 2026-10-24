import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getHistoryMatchCount,
  listRecentHistoryMatches,
} from '@/src/data/history/db';
import { importCsvHistoryIntoApp } from '@/src/data/history/importCsv';
import type { HistoryMatchRow } from '@/src/data/history/types';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function StoricoScreen() {
  const [count, setCount] = useState<number | null>(null);
  const [rows, setRows] = useState<HistoryMatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const n = await getHistoryMatchCount();
      setCount(n);
      setRows(n > 0 ? await listRecentHistoryMatches(50) : []);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Errore DB');
      setCount(0);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onImportCsv = async () => {
    setImporting(true);
    setMessage(null);
    try {
      const { inserted } = await importCsvHistoryIntoApp();
      setMessage(`Importati ${inserted} risultati CSV`);
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message.slice(0, 140) : 'Import fallito');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Storico</Text>
      <Text style={styles.sub}>Risultati passati · DB locale</Text>

      {loading ? (
        <ActivityIndicator color={colors.lime} style={{ marginTop: spacing.xl }} />
      ) : null}

      {!loading && count === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Database vuoto</Text>
          <Text style={styles.emptyBody}>
            Su Windows, dalla cartella del progetto:
          </Text>
          <View style={styles.codeBox}>
            <Text style={styles.code}>node scripts\history\ingest.mjs</Text>
            <Text style={styles.code}>node scripts\history\pack-for-app.mjs</Text>
          </View>
          <Text style={styles.emptyBody}>
            Poi riavvia Expo. CSV gratis (co.uk); football-data.org e API-Football
            solo se hai le chiavi in .env.
          </Text>
          {Platform.OS !== 'web' ? (
            <Pressable
              onPress={onImportCsv}
              disabled={importing}
              style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}>
              <Text style={styles.btnLabel}>
                {importing ? 'Import…' : 'Importa CSV nell’app'}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.emptyBody}>
              Su web il CSV va caricato con lo script Node (CORS). Su telefono puoi
              usare anche il pulsante Importa.
            </Text>
          )}
        </View>
      ) : null}

      {message ? <Text style={styles.msg}>{message}</Text> : null}

      {!loading && count != null && count > 0 ? (
        <>
          <Text style={styles.count}>{count} partite in archivio</Text>
          {rows.map((m, index) => (
            <StaggerItem key={m.id} index={index}>
              <View style={styles.row}>
                <Text style={styles.date}>{m.matchDate}</Text>
                <Text style={styles.comp}>{m.competitionCode}</Text>
                <View style={styles.teams}>
                  <TeamCrest uri={m.homeCrest} name={m.homeName} size={28} delay={40} />
                  <Text style={styles.score}>
                    {m.homeGoals}:{m.awayGoals}
                  </Text>
                  <TeamCrest uri={m.awayCrest} name={m.awayName} size={28} delay={70} />
                </View>
                <Text style={styles.names} numberOfLines={1}>
                  {m.homeName} – {m.awayName}
                </Text>
              </View>
            </StaggerItem>
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.brand,
    fontSize: 48,
    lineHeight: 50,
    color: colors.text,
    letterSpacing: 1,
  },
  sub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  empty: {
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  emptyBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  codeBox: {
    backgroundColor: colors.night,
    borderRadius: 8,
    padding: spacing.md,
    gap: 6,
  },
  code: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.lime,
  },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lime,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.night,
  },
  msg: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
  count: {
    marginBottom: spacing.md,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  row: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: 6,
  },
  date: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  comp: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.lime,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  score: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.text,
    minWidth: 48,
    textAlign: 'center',
  },
  names: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
});
