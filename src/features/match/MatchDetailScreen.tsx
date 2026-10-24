import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockFixtures } from '@/src/data/mock/fixtures';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = mockFixtures.find((m) => m.id === id);

  const home = match?.home.name ?? 'Casa';
  const away = match?.away.name ?? 'Ospite';
  const comp = match?.competitionName ?? 'Competizione';
  const live = match?.status === 'live';

  return (
    <Screen>
      <Text style={styles.kicker}>Partita</Text>
      <Text style={styles.comp}>{comp}</Text>
      <Text style={styles.title}>
        {home}
        {'\n'}
        <Text style={styles.vs}>vs</Text>
        {'\n'}
        {away}
      </Text>

      {live && match?.score ? (
        <View style={styles.scoreBlock}>
          <Text style={styles.live}>LIVE</Text>
          <Text style={styles.score}>
            {match.score.home} – {match.score.away}
          </Text>
        </View>
      ) : (
        <Text style={styles.meta}>id · {id ?? '—'}</Text>
      )}

      <View style={styles.divider} />
      <Text style={styles.body}>
        Eventi, stats e H2H arriveranno con football-data.org e API-Football.
        Da qui si aprirà anche la lettura quote.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.lime,
    marginBottom: spacing.sm,
  },
  comp: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.brand,
    fontSize: 48,
    lineHeight: 52,
    color: colors.text,
    letterSpacing: 1,
  },
  vs: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  scoreBlock: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  live: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.lime,
  },
  score: {
    fontFamily: fonts.brand,
    fontSize: 56,
    lineHeight: 58,
    color: colors.text,
  },
  meta: {
    marginTop: spacing.md,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.lime,
  },
  divider: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
});
