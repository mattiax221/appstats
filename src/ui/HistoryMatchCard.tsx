import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { HistoryMatchRow } from '@/src/data/history/types';
import { competitionBadgeUrl } from '@/src/data/history/catalog';

import { PressableScale } from './PressableScale';
import { TeamCrest } from './TeamCrest';
import { colors, fonts, spacing } from './theme';
import { layout } from './tokens';

type HistoryMatchCardProps = {
  match: HistoryMatchRow;
  enterDelay?: number;
};

/** Unified finished-match card — same grammar as live MatchRow. */
export function HistoryMatchCard({ match, enterDelay = 0 }: HistoryMatchCardProps) {
  const badge = competitionBadgeUrl(match.competitionCode);

  return (
    <Link href={`/match/h-${match.id}`} asChild>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${match.homeName} ${match.homeGoals} ${match.awayName} ${match.awayGoals}`}
        style={styles.row}
        scaleTo={0.985}>
        <View style={styles.top}>
          <View style={styles.comp}>
            {badge ? (
              <Image source={{ uri: badge }} style={styles.badge} resizeMode="contain" />
            ) : null}
            <Text style={styles.compCode}>{match.competitionCode}</Text>
          </View>
          <Text style={styles.date}>{match.matchDate}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.side}>
            <TeamCrest
              uri={match.homeCrest}
              name={match.homeName}
              size={layout.crestMd}
              delay={enterDelay}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {match.homeName}
            </Text>
          </View>

          <View style={styles.center}>
            <Text style={styles.score}>
              {match.homeGoals}
              <Text style={styles.scoreSep}>:</Text>
              {match.awayGoals}
            </Text>
            {match.htHomeGoals != null && match.htAwayGoals != null ? (
              <Text style={styles.ht}>
                HT {match.htHomeGoals}:{match.htAwayGoals}
              </Text>
            ) : null}
          </View>

          <View style={styles.side}>
            <TeamCrest
              uri={match.awayCrest}
              name={match.awayName}
              size={layout.crestMd}
              delay={enterDelay + 50}
            />
            <Text style={styles.teamName} numberOfLines={1}>
              {match.awayName}
            </Text>
          </View>
        </View>
      </PressableScale>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: layout.cardPad,
    paddingHorizontal: layout.cardPad,
    marginBottom: layout.rowGap,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
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
  comp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: { width: 16, height: 16 },
  compCode: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  date: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
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
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    color: colors.text,
    letterSpacing: 0.5,
  },
  scoreSep: {
    color: colors.textMuted,
    fontSize: 18,
  },
  ht: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
});
