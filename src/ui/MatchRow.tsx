import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Match } from '@/src/domain';

import { colors, fonts, spacing } from './theme';

type MatchRowProps = {
  match: Match;
};

function statusLabel(match: Match): { text: string; live?: boolean } {
  if (match.status === 'live') return { text: 'LIVE', live: true };
  if (match.status === 'finished') {
    return {
      text: `${match.score?.home ?? 0} – ${match.score?.away ?? 0}`,
    };
  }
  const d = new Date(match.utcDate);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return { text: `${hh}:${mm}` };
}

export function MatchRow({ match }: MatchRowProps) {
  const status = statusLabel(match);
  const home = match.home.shortName ?? match.home.name;
  const away = match.away.shortName ?? match.away.name;

  return (
    <Link href={`/match/${match.id}`} asChild>
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${match.home.name} contro ${match.away.name}`}>
        <View style={styles.compCol}>
          <Text style={styles.comp}>{match.competitionName ?? match.competitionId}</Text>
          {match.matchday != null ? (
            <Text style={styles.md}>G{match.matchday}</Text>
          ) : null}
        </View>

        <View style={styles.teams}>
          <Text style={styles.team} numberOfLines={1}>
            {home}
          </Text>
          <Text style={styles.vs}>–</Text>
          <Text style={styles.team} numberOfLines={1}>
            {away}
          </Text>
        </View>

        <View style={styles.statusCol}>
          {match.status === 'live' && match.score ? (
            <Text style={styles.score}>
              {match.score.home}–{match.score.away}
            </Text>
          ) : null}
          <Text style={[styles.status, status.live && styles.statusLive]}>{status.text}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  compCol: {
    width: 72,
    gap: 2,
  },
  comp: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: colors.textMuted,
  },
  md: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  teams: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  team: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.text,
    flexShrink: 1,
  },
  vs: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  statusCol: {
    alignItems: 'flex-end',
    minWidth: 52,
    gap: 2,
  },
  score: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.text,
  },
  status: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSoft,
  },
  statusLive: {
    color: colors.lime,
    letterSpacing: 1.2,
  },
});
