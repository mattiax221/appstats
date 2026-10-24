import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { leagueFilters, mockFixtures } from '@/src/data/mock/fixtures';
import { BrandMark } from '@/src/ui/BrandMark';
import { FilterChip } from '@/src/ui/Chip';
import { MatchRow } from '@/src/ui/MatchRow';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function HomeScreen() {
  const [league, setLeague] = useState<string>('all');

  const filtered = useMemo(() => {
    if (league === 'all') return mockFixtures;
    return mockFixtures.filter((m) => m.competitionId === league);
  }, [league]);

  const live = filtered.filter((m) => m.status === 'live');
  const upcoming = filtered.filter((m) => m.status !== 'live');

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
        <Text style={styles.empty}>Nessuna partita</Text>
      ) : (
        upcoming.map((match, index) => (
          <StaggerItem key={match.id} index={live.length + index}>
            <MatchRow match={match} enterDelay={120 + (live.length + index) * 45} />
          </StaggerItem>
        ))
      )}
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
    marginBottom: spacing.xs,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
});
