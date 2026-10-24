import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  ensureHistoryReady,
  getHistoryMatchCount,
  listRecentHistoryMatches,
} from '@/src/data/history/db';
import type { HistoryMatchRow } from '@/src/data/history/types';
import { HistoryMatchCard } from '@/src/ui/HistoryMatchCard';
import { Screen } from '@/src/ui/Screen';
import { ScreenHeader } from '@/src/ui/ScreenHeader';
import { SkeletonList } from '@/src/ui/Skeleton';
import { StaggerItem } from '@/src/ui/StaggerItem';
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
      setMessage(e instanceof Error ? e.message : 'Errore archivio');
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
      <ScreenHeader
        title="Storico"
        subtitle="Serie A · Premier · risultati finiti"
        right={
          count != null && !loading ? (
            <Text style={styles.count}>{count}</Text>
          ) : null
        }
      />

      {loading ? <SkeletonList count={5} /> : null}
      {message ? <Text style={styles.msg}>{message}</Text> : null}

      {!loading
        ? rows.map((m, index) => (
            <StaggerItem key={m.id} index={index}>
              <HistoryMatchCard match={m} enterDelay={40 + index * 30} />
            </StaggerItem>
          ))
        : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  count: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.lime,
  },
  msg: {
    marginBottom: spacing.md,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
});
