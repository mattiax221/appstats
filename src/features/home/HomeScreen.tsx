import { StyleSheet, Text, View } from 'react-native';

import { mockFixtures } from '@/src/data/mock/fixtures';
import { BrandMark } from '@/src/ui/BrandMark';
import { MatchRow } from '@/src/ui/MatchRow';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function HomeScreen() {
  const live = mockFixtures.filter((m) => m.status === 'live');
  const upcoming = mockFixtures.filter((m) => m.status !== 'live');

  return (
    <Screen>
      <View style={styles.hero}>
        <BrandMark size="hero" />
        <Text style={styles.headline}>Cosa c’è in campo oggi</Text>
        <Text style={styles.support}>
          Giornata, forma e lettura del mercato — senza rumore.
        </Text>
      </View>

      <View style={styles.pitchBand} accessibilityElementsHidden>
        <View style={styles.pitchBandInner} />
        <View style={styles.pitchCircle} />
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

      <SectionHeader title="Prossime" subtitle="Serie A e top league · mock fino a P1" />
      {upcoming.map((match, index) => (
        <StaggerItem key={match.id} index={live.length + index}>
          <MatchRow match={match} />
        </StaggerItem>
      ))}

      <Text style={styles.footnote}>
        Dati placeholder. Le API gratuite arrivano in P1–P4.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 280,
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
  pitchBand: {
    height: 96,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(244, 247, 241, 0.28)',
  },
  footnote: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
