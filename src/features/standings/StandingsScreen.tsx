import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { hasFootballDataKey } from '@/src/config/env';
import { ApiKeyEmptyState } from '@/src/ui/ApiKeyEmptyState';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

import { useStandings } from './useStandings';

export function StandingsScreen() {
  const { competitionId } = useLocalSearchParams<{ competitionId: string }>();
  const code = (competitionId ?? 'SA').toUpperCase();
  const hasKey = hasFootballDataKey();
  const { data, isLoading, isError, error } = useStandings(code);

  return (
    <Screen>
      <Text style={styles.title}>Classifica</Text>
      <Text style={styles.code}>{data?.competitionName ?? code}</Text>

      {!hasKey ? <ApiKeyEmptyState /> : null}

      {hasKey && isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.lime} />
        </View>
      ) : null}

      {hasKey && isError ? (
        <Text style={styles.error}>
          {error instanceof Error ? error.message.slice(0, 140) : 'Errore'}
        </Text>
      ) : null}

      {hasKey && data?.table?.length ? (
        <View style={styles.table}>
          <View style={styles.head}>
            <Text style={[styles.headCell, styles.pos]}>#</Text>
            <Text style={[styles.headCell, styles.team]}>Squadra</Text>
            <Text style={[styles.headCell, styles.num]}>G</Text>
            <Text style={[styles.headCell, styles.num]}>Pt</Text>
          </View>
          {data.table.map((row, index) => (
            <StaggerItem key={row.team.id} index={index}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.pos]}>{row.position}</Text>
                <View style={styles.teamCell}>
                  <TeamCrest
                    uri={row.team.crestUrl}
                    name={row.team.name}
                    size={28}
                    delay={40 + index * 30}
                  />
                  <Text style={styles.teamName} numberOfLines={1}>
                    {row.team.shortName ?? row.team.name}
                  </Text>
                </View>
                <Text style={[styles.cell, styles.num]}>{row.played}</Text>
                <Text style={[styles.cell, styles.num, styles.pts]}>{row.points}</Text>
              </View>
            </StaggerItem>
          ))}
        </View>
      ) : null}

      {hasKey && !isLoading && !isError && !data?.table?.length ? (
        <Text style={styles.empty}>Nessuna classifica</Text>
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
  code: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
  },
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.nightLift,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  headCell: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  cell: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  pos: { width: 28, textAlign: 'center' },
  team: { flex: 1 },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  teamName: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  num: { width: 36, textAlign: 'center' },
  pts: { color: colors.lime, fontFamily: fonts.bodyBold },
});
