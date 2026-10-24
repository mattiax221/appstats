import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { leagueFilters, mockFixtures } from '@/src/data/mock/fixtures';
import { BrandMark } from '@/src/ui/BrandMark';
import { FilterChip } from '@/src/ui/Chip';
import { MatchRow } from '@/src/ui/MatchRow';
import { PrimaryButton } from '@/src/ui/PrimaryButton';
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
  const featured = live[0] ?? upcoming[0];

  return (
    <Screen>
      <View style={styles.hero}>
        <BrandMark size="hero" />
        <Text style={styles.headline}>Cosa c’è in campo oggi</Text>
        <Text style={styles.support}>
          Score live, crests e lettura del mercato — stile matchday.
        </Text>
        {featured ? (
          <PrimaryButton
            label={
              featured.status === 'live'
                ? `Apri ${featured.home.shortName}–${featured.away.shortName}`
                : 'Vedi partita in evidenza'
            }
            onPress={() => router.push(`/match/${featured.id}`)}
            style={styles.cta}
          />
        ) : null}
      </View>

      <View style={styles.pitchBand} accessibilityElementsHidden>
        <View style={styles.pitchBandInner} />
        <View style={styles.pitchCircle} />
      </View>

      <Text style={styles.filterLabel}>Competizioni</Text>
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
          <SectionHeader title="Live" subtitle="Aggiornamento manuale sul piano free" />
          {live.map((match, index) => (
            <StaggerItem key={match.id} index={index}>
              <MatchRow match={match} />
            </StaggerItem>
          ))}
        </>
      ) : null}

      <SectionHeader title="Prossime" subtitle="Crest e orari · mock fino a P1" />
      {upcoming.length === 0 ? (
        <Text style={styles.empty}>Nessuna partita per questo filtro.</Text>
      ) : (
        upcoming.map((match, index) => (
          <StaggerItem key={match.id} index={live.length + index}>
            <MatchRow match={match} />
          </StaggerItem>
        ))
      )}

      <Text style={styles.footnote}>
        Stemmi da media.api-sports.io (demo). Dati partita ancora mock.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  headline: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
    maxWidth: 300,
    marginTop: spacing.sm,
  },
  support: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 320,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  pitchBand: {
    height: 88,
    marginHorizontal: -spacing.lg,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(244, 247, 241, 0.28)',
  },
  filterLabel: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
  footnote: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
