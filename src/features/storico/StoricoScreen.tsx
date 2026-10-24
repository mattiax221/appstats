import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  ensureHistoryReady,
  getHistoryMatchCount,
  listRecentHistoryMatches,
} from '@/src/data/history/db';
import type { HistoryMatchRow } from '@/src/data/history/types';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function StoricoScreen() {
  const [count, setCount] = useState<number | null>(null);
  const [rows, setRows] = useState<HistoryMatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await ensureHistoryReady();
      const n = await getHistoryMatchCount();
      setCount(n);
      setRows(await listRecentHistoryMatches(60));
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

  return (
    <Screen>
      <Text style={styles.title}>Storico</Text>
      <Text style={styles.sub}>Serie A · Premier · risultati finiti</Text>

      {loading ? (
        <ActivityIndicator color={colors.lime} style={{ marginTop: spacing.xl }} />
      ) : null}

      {message ? <Text style={styles.msg}>{message}</Text> : null}

      {!loading && count != null ? (
        <Text style={styles.count}>{count} partite in archivio</Text>
      ) : null}

      {!loading
        ? rows.map((m, index) => (
            <StaggerItem key={m.id} index={Math.min(index, 12)}>
              <Link href={`/match/h-${m.id}`} asChild>
                <PressableScale style={styles.row} scaleTo={0.98}>
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
                </PressableScale>
              </Link>
            </StaggerItem>
          ))
        : null}
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
