import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { hasFootballDataKey } from '@/src/config/env';
import { leagueFilters } from '@/src/data/mock/fixtures';
import { ApiKeyEmptyState } from '@/src/ui/ApiKeyEmptyState';
import { BrandMark } from '@/src/ui/BrandMark';
import { FilterChip } from '@/src/ui/Chip';
import { MatchRow } from '@/src/ui/MatchRow';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { colors, fonts, spacing } from '@/src/ui/theme';

import { useHomeFixtures } from './useHomeFixtures';

export function HomeScreen() {
  const [league, setLeague] = useState<string>('all');
  const hasKey = hasFootballDataKey();
  const { data, isLoading, isError, error, refetch, isFetching } = useHomeFixtures();

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (league === 'all') return list;
    return list.filter((m) => m.competitionId === league);
  }, [data, league]);

  const live = filtered.filter((m) => m.status === 'live');
  const upcoming = filtered.filter((m) => m.status !== 'live');
  const standingsCode = league === 'all' ? 'SA' : league;

  return (
    <Screen>
      <View style={styles.hero}>
        <BrandMark size="hero" />
      </View>

      <View style={styles.pitchBand} accessibilityElementsHidden>
        <View style={styles.pitchBandInner} />
        <View style={styles.pitchCircle} />
      </View>

      <View style={styles.filters}>
        {leagueFilters.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            crestUrl={'crestUrl' in f ? f.crestUrl : undefined}
            selected={league === f.id}
            onPress={() => setLeague(f.id)}
          />
        ))}
      </View>

      {hasKey ? (
        <PressableScale
          onPress={() => router.push(`/standings/${standingsCode}`)}
          style={styles.classifica}
          scaleTo={0.98}>
          <Text style={styles.classificaLabel}>Classifica · {standingsCode}</Text>
          <Text style={styles.chev}>›</Text>
        </PressableScale>
      ) : null}

      {!hasKey ? <ApiKeyEmptyState /> : null}

      {hasKey && isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.lime} />
        </View>
      ) : null}

      {hasKey && isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Errore API: {error instanceof Error ? error.message.slice(0, 120) : 'sconosciuto'}
          </Text>
          <PressableScale onPress={() => refetch()} style={styles.retry}>
            <Text style={styles.retryText}>{isFetching ? '…' : 'Riprova'}</Text>
          </PressableScale>
        </View>
      ) : null}

      {hasKey && !isLoading && !isError ? (
        <>
          {live.length > 0 ? (
            <>
              <SectionHeader title="Live" />
              {live.map((match, index) => (
                <StaggerItem key={match.id} index={index}>
                  <MatchRow match={match} enterDelay={80 + index * 40} />
                </StaggerItem>
              ))}
            </>
          ) : null}

          <SectionHeader title="Prossime" />
          {upcoming.length === 0 ? (
            <Text style={styles.empty}>Nessuna partita in questo periodo</Text>
          ) : (
            upcoming.map((match, index) => (
              <StaggerItem key={match.id} index={live.length + index}>
                <MatchRow
                  match={match}
                  enterDelay={120 + (live.length + index) * 45}
                />
              </StaggerItem>
            ))
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  pitchBand: {
    height: 72,
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.pitch,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pitchBandInner: {
    height: 2,
    backgroundColor: 'rgba(244, 247, 241, 0.35)',
    marginHorizontal: spacing.xl,
  },
  pitchCircle: {
    position: 'absolute',
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(244, 247, 241, 0.28)',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  classifica: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.limeLine,
  },
  classificaLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.lime,
  },
  chev: {
    fontFamily: fonts.body,
    fontSize: 20,
    color: colors.lime,
  },
  center: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
  errorBox: {
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.limeDim,
  },
  retryText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.lime,
  },
});
