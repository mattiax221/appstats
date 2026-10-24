import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockFixtures } from '@/src/data/mock/fixtures';
import { CompetitionBadge } from '@/src/ui/Chip';
import { LiveBadge } from '@/src/ui/LiveBadge';
import { PrimaryButton } from '@/src/ui/PrimaryButton';
import { Screen } from '@/src/ui/Screen';
import { ScorePill } from '@/src/ui/ScorePill';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = mockFixtures.find((m) => m.id === id);
  const live = match?.status === 'live';

  const home = match?.home.name ?? 'Casa';
  const away = match?.away.name ?? 'Ospite';

  return (
    <Screen>
      <View style={styles.top}>
        <CompetitionBadge
          name={match?.competitionName ?? 'Competizione'}
          crestUrl={match?.competitionCrestUrl}
          matchday={match?.matchday}
        />
        {live ? <LiveBadge minute={match?.liveMinute} /> : null}
      </View>

      <View style={styles.teams}>
        <View style={styles.team}>
          <TeamCrest uri={match?.home.crestUrl} name={home} size={64} />
          <Text style={styles.teamName}>{home}</Text>
        </View>
        <View style={styles.mid}>
          {match?.score ? (
            <ScorePill home={match.score.home} away={match.score.away} live={live} />
          ) : (
            <Text style={styles.vs}>vs</Text>
          )}
        </View>
        <View style={styles.team}>
          <TeamCrest uri={match?.away.crestUrl} name={away} size={64} />
          <Text style={styles.teamName}>{away}</Text>
        </View>
      </View>

      <Text style={styles.meta}>id · {id ?? '—'}</Text>

      <View style={styles.divider} />
      <Text style={styles.body}>
        Eventi, stats e H2H arriveranno con football-data.org e API-Football.
      </Text>

      <PrimaryButton
        label="Vai alle previsioni"
        variant="ghost"
        onPress={() => router.push('/previsioni')}
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.md,
  },
  teamName: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  mid: {
    width: 80,
    alignItems: 'center',
  },
  vs: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  meta: {
    marginTop: spacing.lg,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
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
  cta: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});
