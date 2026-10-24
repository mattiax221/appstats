import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getH2H,
  getMatch,
  getTeam,
  getTeamStats,
  parseHistoryMatchParam,
  toHistoryRow,
} from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = parseHistoryMatchParam(typeof id === 'string' ? id : undefined);
  const match = matchId != null ? getMatch(matchId) : null;
  const row = match ? toHistoryRow(match) : null;
  const home = match ? getTeam(match.homeTeamId) : null;
  const away = match ? getTeam(match.awayTeamId) : null;
  const h2h = useMemo(
    () =>
      match ? getH2H(match.homeTeamId, match.awayTeamId, 10) : null,
    [match],
  );
  const homeForm = match ? getTeamStats(match.homeTeamId, 5).form : [];
  const awayForm = match ? getTeamStats(match.awayTeamId, 5).form : [];

  if (!match || !row || !home || !away || !h2h) {
    return (
      <Screen>
        <Text style={styles.missing}>Partita non nello storico locale</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.comp}>
        {row.competitionName} · {row.season}
      </Text>
      <Text style={styles.date}>{row.matchDate}</Text>

      <View style={styles.teams}>
        <Link href={`/team/${home.id}`} asChild>
          <PressableScale style={styles.team} scaleTo={0.97}>
            <TeamCrest uri={home.crestUrl} name={home.name} size={64} delay={80} />
            <Text style={styles.teamName}>{home.name}</Text>
            <FormDots form={homeForm} />
          </PressableScale>
        </Link>
        <View style={styles.mid}>
          <Text style={styles.score}>
            {row.homeGoals}:{row.awayGoals}
          </Text>
          {row.htHomeGoals != null && row.htAwayGoals != null ? (
            <Text style={styles.ht}>
              HT {row.htHomeGoals}:{row.htAwayGoals}
            </Text>
          ) : null}
        </View>
        <Link href={`/team/${away.id}`} asChild>
          <PressableScale style={styles.team} scaleTo={0.97}>
            <TeamCrest uri={away.crestUrl} name={away.name} size={64} delay={140} />
            <Text style={styles.teamName}>{away.name}</Text>
            <FormDots form={awayForm} />
          </PressableScale>
        </Link>
      </View>

      <SectionHeader title="H2H" />
      <View style={styles.h2hBar}>
        <Text style={styles.h2hNum}>{h2h.teamAWins}</Text>
        <Text style={styles.h2hLabel}>V {home.name}</Text>
        <Text style={styles.h2hNum}>{h2h.draws}</Text>
        <Text style={styles.h2hLabel}>N</Text>
        <Text style={styles.h2hNum}>{h2h.teamBWins}</Text>
        <Text style={styles.h2hLabel}>V {away.name}</Text>
      </View>
      <Text style={styles.h2hMeta}>{h2h.played} confronti nello storico</Text>

      {h2h.matches.map((m) => {
        const r = toHistoryRow(m);
        return (
          <Link key={m.id} href={`/match/h-${m.id}`} asChild>
            <PressableScale style={styles.h2hRow} scaleTo={0.98}>
              <Text style={styles.h2hDate}>{r.matchDate}</Text>
              <Text style={styles.h2hScore}>
                {r.homeName} {r.homeGoals}:{r.awayGoals} {r.awayName}
              </Text>
            </PressableScale>
          </Link>
        );
      })}
    </Screen>
  );
}

function FormDots({ form }: { form: Array<'V' | 'N' | 'P'> }) {
  return (
    <View style={styles.formRow}>
      {form.map((r, i) => (
        <View
          key={`${r}-${i}`}
          style={[
            styles.dot,
            r === 'V' && styles.dotWin,
            r === 'N' && styles.dotDraw,
            r === 'P' && styles.dotLoss,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  missing: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  comp: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  date: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamName: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  mid: {
    width: 72,
    alignItems: 'center',
    paddingTop: 18,
  },
  score: {
    fontFamily: fonts.brand,
    fontSize: 40,
    lineHeight: 42,
    color: colors.text,
  },
  ht: {
    marginTop: 4,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  formRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.charcoal,
  },
  dotWin: { backgroundColor: colors.lime },
  dotDraw: { backgroundColor: colors.textMuted },
  dotLoss: { backgroundColor: colors.danger },
  h2hBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  h2hNum: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    color: colors.lime,
  },
  h2hLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  h2hMeta: {
    marginBottom: spacing.md,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
  h2hRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    gap: 2,
  },
  h2hDate: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  h2hScore: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
});
