import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockMarkets } from '@/src/data/mock/fixtures';
import { CompetitionBadge, TimeChip } from '@/src/ui/Chip';
import { FadeIn } from '@/src/ui/FadeIn';
import { OddsBar } from '@/src/ui/OddsBar';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function PredictionsScreen() {
  const featured = mockMarkets[0];
  const rest = mockMarkets.slice(1);

  const topKey = (c: { home: number; draw: number; away: number }) => {
    if (c.home >= c.draw && c.home >= c.away) return '1' as const;
    if (c.away > c.draw) return '2' as const;
    return 'X' as const;
  };

  return (
    <Screen>
      <Text style={styles.title}>Previsioni</Text>

      <FadeIn delay={80} style={styles.featured}>
        <View style={styles.featuredTop}>
          <CompetitionBadge
            name={featured.competition}
            crestUrl={featured.competitionCrestUrl}
          />
          <TimeChip label={featured.kickoffLabel} />
        </View>

        <View style={styles.teamsRow}>
          <View style={styles.teamBlock}>
            <TeamCrest uri={featured.homeCrest} name={featured.home} size={52} delay={120} />
            <Text style={styles.teamName}>{featured.home}</Text>
          </View>
          <Text style={styles.vs}>vs</Text>
          <View style={styles.teamBlock}>
            <TeamCrest uri={featured.awayCrest} name={featured.away} size={52} delay={180} />
            <Text style={styles.teamName}>{featured.away}</Text>
          </View>
        </View>

        <OddsBar
          label="1"
          value={featured.consensus.home}
          odds={featured.odds.home}
          delay={220}
          emphasize={topKey(featured.consensus) === '1'}
        />
        <OddsBar
          label="X"
          value={featured.consensus.draw}
          odds={featured.odds.draw}
          delay={300}
          emphasize={topKey(featured.consensus) === 'X'}
        />
        <OddsBar
          label="2"
          value={featured.consensus.away}
          odds={featured.odds.away}
          delay={380}
          emphasize={topKey(featured.consensus) === '2'}
        />
      </FadeIn>

      <Text style={styles.listTitle}>Altre</Text>
      {rest.map((m, i) => {
        const tip = topKey(m.consensus);
        const pct = Math.round(
          (tip === '1' ? m.consensus.home : tip === '2' ? m.consensus.away : m.consensus.draw) *
            100,
        );
        return (
          <PressableScale
            key={m.matchId}
            onPress={() => router.push(`/match/${m.matchId}`)}
            style={styles.listRow}
            scaleTo={0.98}>
            <TeamCrest uri={m.homeCrest} name={m.home} size={32} delay={200 + i * 50} />
            <View style={styles.listMain}>
              <Text style={styles.listMatch}>
                {m.home} – {m.away}
              </Text>
              <Text style={styles.listMeta}>{m.kickoffLabel}</Text>
            </View>
            <TeamCrest uri={m.awayCrest} name={m.away} size={32} delay={240 + i * 50} />
            <Text style={styles.listTip}>
              {tip} · {pct}%
            </Text>
          </PressableScale>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.brand,
    fontSize: 48,
    lineHeight: 50,
    color: colors.text,
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  featured: {
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.sm,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  teamBlock: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamName: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  vs: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  listTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  listMain: { flex: 1, gap: 2, minWidth: 0 },
  listMatch: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  listMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  listTip: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.lime,
    marginLeft: spacing.xs,
  },
});
