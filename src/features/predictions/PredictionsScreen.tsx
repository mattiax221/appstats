import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockMarkets } from '@/src/data/mock/fixtures';
import { CompetitionBadge, TimeChip } from '@/src/ui/Chip';
import { FadeIn } from '@/src/ui/FadeIn';
import { OddsBar } from '@/src/ui/OddsBar';
import { PressableScale } from '@/src/ui/PressableScale';
import { PrimaryButton } from '@/src/ui/PrimaryButton';
import { Screen } from '@/src/ui/Screen';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

/** UI stub with mock consensus + crests; P4 wires The Odds API. */
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
      <Text style={styles.kicker}>Previsioni</Text>
      <Text style={styles.title}>Lettura del mercato</Text>
      <Text style={styles.body}>
        Probabilità 1X2 implicite dalle quote — consenso tra bookmaker, non un
        modello ML.
      </Text>

      <FadeIn delay={100} style={styles.featured}>
        <View style={styles.featuredTop}>
          <CompetitionBadge
            name={featured.competition}
            crestUrl={featured.competitionCrestUrl}
          />
          <TimeChip label={featured.kickoffLabel} />
        </View>

        <View style={styles.teamsRow}>
          <View style={styles.teamBlock}>
            <TeamCrest uri={featured.homeCrest} name={featured.home} size={52} />
            <Text style={styles.teamName}>{featured.home}</Text>
          </View>
          <Text style={styles.vs}>vs</Text>
          <View style={styles.teamBlock}>
            <TeamCrest uri={featured.awayCrest} name={featured.away} size={52} />
            <Text style={styles.teamName}>{featured.away}</Text>
          </View>
        </View>

        <View style={styles.bars}>
          <OddsBar
            label="1"
            value={featured.consensus.home}
            odds={featured.odds.home}
            delay={200}
            emphasize={topKey(featured.consensus) === '1'}
          />
          <OddsBar
            label="X"
            value={featured.consensus.draw}
            odds={featured.odds.draw}
            delay={280}
            emphasize={topKey(featured.consensus) === 'X'}
          />
          <OddsBar
            label="2"
            value={featured.consensus.away}
            odds={featured.odds.away}
            delay={360}
            emphasize={topKey(featured.consensus) === '2'}
          />
        </View>

        <PrimaryButton
          label="Apri dettaglio partita"
          onPress={() => router.push(`/match/${featured.matchId}`)}
          style={styles.cta}
        />
      </FadeIn>

      <Text style={styles.listTitle}>Altre in focus</Text>
      {rest.map((m) => {
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
            <TeamCrest uri={m.homeCrest} name={m.home} size={32} />
            <View style={styles.listMain}>
              <Text style={styles.listMatch}>
                {m.home} – {m.away}
              </Text>
              <Text style={styles.listMeta}>{m.kickoffLabel}</Text>
            </View>
            <TeamCrest uri={m.awayCrest} name={m.away} size={32} />
            <Text style={styles.listTip}>
              {tip} · {pct}%
            </Text>
          </PressableScale>
        );
      })}

      <Text style={styles.disclaimer}>
        Non è un consiglio di scommessa. Barre e stemmi sono mock fino a P4.
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
  title: {
    fontFamily: fonts.brand,
    fontSize: 48,
    lineHeight: 50,
    color: colors.text,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 360,
  },
  featured: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
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
  bars: { marginTop: spacing.xs },
  cta: { marginTop: spacing.sm },
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
  disclaimer: {
    marginTop: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
