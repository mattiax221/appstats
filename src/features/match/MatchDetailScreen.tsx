import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { hasFootballDataKey } from '@/src/config/env';
import { matchesRepository } from '@/src/data/repositories';
import { CompetitionBadge } from '@/src/ui/Chip';
import { LiveBadge } from '@/src/ui/LiveBadge';
import { Screen } from '@/src/ui/Screen';
import { ScorePill } from '@/src/ui/ScorePill';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = id ?? '';
  const hasKey = hasFootballDataKey();

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => matchesRepository.getById(matchId),
    enabled: hasKey && Boolean(matchId),
    staleTime: matchesRepository.staleTime,
    refetchOnWindowFocus: false,
  });

  const live = match?.status === 'live';
  const home = match?.home.name ?? 'Casa';
  const away = match?.away.name ?? 'Ospite';

  return (
    <Screen>
      {isLoading ? (
        <ActivityIndicator color={colors.lime} style={{ marginTop: spacing.xl }} />
      ) : null}

      {!isLoading && !match ? (
        <Text style={styles.missing}>Partita non disponibile</Text>
      ) : null}

      {match ? (
        <>
          <View style={styles.top}>
            <CompetitionBadge
              name={match.competitionName ?? match.competitionId}
              matchday={match.matchday}
            />
            {live ? <LiveBadge /> : null}
          </View>

          <View style={styles.teams}>
            <View style={styles.team}>
              <TeamCrest uri={match.home.crestUrl} name={home} size={64} delay={80} />
              <Text style={styles.teamName}>{home}</Text>
            </View>
            <View style={styles.mid}>
              {match.score ? (
                <ScorePill home={match.score.home} away={match.score.away} live={live} />
              ) : (
                <Text style={styles.vs}>vs</Text>
              )}
            </View>
            <View style={styles.team}>
              <TeamCrest uri={match.away.crestUrl} name={away} size={64} delay={140} />
              <Text style={styles.teamName}>{away}</Text>
            </View>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
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
});
