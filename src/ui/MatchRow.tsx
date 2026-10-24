import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import type { Match } from '@/src/domain';

import { CompetitionBadge, TimeChip } from './Chip';
import { LiveBadge } from './LiveBadge';
import { PressableScale } from './PressableScale';
import { ScorePill } from './ScorePill';
import { TeamCrest } from './TeamCrest';
import { colors, fonts, spacing } from './theme';

type MatchRowProps = {
  match: Match & { liveMinute?: number; competitionCrestUrl?: string };
  enterDelay?: number;
};

function kickoffTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function MatchRow({ match, enterDelay = 0 }: MatchRowProps) {
  const live = match.status === 'live';

  return (
    <Link href={`/match/${match.id}`} asChild>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${match.home.name} contro ${match.away.name}`}
        style={styles.row}
        scaleTo={0.985}>
        <View style={styles.top}>
          <CompetitionBadge
            name={match.competitionName ?? match.competitionId}
            crestUrl={match.competitionCrestUrl}
            matchday={match.matchday}
          />
          {live ? (
            <LiveBadge minute={match.liveMinute} />
          ) : (
            <TimeChip label={kickoffTime(match.utcDate)} />
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.side}>
            <TeamCrest
              uri={match.home.crestUrl}
              name={match.home.name}
              size={40}
              delay={enterDelay}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {match.home.name}
            </Text>
          </View>

          <View style={styles.center}>
            {live || match.status === 'finished' ? (
              <ScorePill
                home={match.score?.home}
                away={match.score?.away}
                live={live}
              />
            ) : (
              <Text style={styles.vs}>vs</Text>
            )}
          </View>

          <View style={styles.side}>
            <TeamCrest
              uri={match.away.crestUrl}
              name={match.away.name}
              size={40}
              delay={enterDelay + 60}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {match.away.name}
            </Text>
          </View>
        </View>
      </PressableScale>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  side: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  teamName: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    width: '100%',
  },
  center: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vs: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
});
