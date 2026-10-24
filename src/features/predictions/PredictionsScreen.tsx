import { StyleSheet, Text, View } from 'react-native';

import { mockMarkets } from '@/src/data/mock/fixtures';
import { FadeIn } from '@/src/ui/FadeIn';
import { OddsBar } from '@/src/ui/OddsBar';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

/** UI stub with mock consensus; P4 wires The Odds API. */
export function PredictionsScreen() {
  const featured = mockMarkets[0];
  const rest = mockMarkets.slice(1);

  return (
    <Screen>
      <Text style={styles.kicker}>Previsioni</Text>
      <Text style={styles.title}>Lettura del mercato</Text>
      <Text style={styles.body}>
        Probabilità 1X2 implicite dalle quote — consenso tra bookmaker, non un
        modello ML.
      </Text>

      <FadeIn delay={120} style={styles.featured}>
        <Text style={styles.featuredComp}>{featured.competition}</Text>
        <Text style={styles.featuredMatch}>
          {featured.home} – {featured.away}
        </Text>
        <Text style={styles.featuredKick}>{featured.kickoffLabel}</Text>

        <View style={styles.bars}>
          <OddsBar
            label="1"
            value={featured.consensus.home}
            odds={featured.odds.home}
            delay={200}
            emphasize={
              featured.consensus.home >= featured.consensus.draw &&
              featured.consensus.home >= featured.consensus.away
            }
          />
          <OddsBar
            label="X"
            value={featured.consensus.draw}
            odds={featured.odds.draw}
            delay={280}
            emphasize={
              featured.consensus.draw > featured.consensus.home &&
              featured.consensus.draw >= featured.consensus.away
            }
          />
          <OddsBar
            label="2"
            value={featured.consensus.away}
            odds={featured.odds.away}
            delay={360}
            emphasize={
              featured.consensus.away > featured.consensus.home &&
              featured.consensus.away > featured.consensus.draw
            }
          />
        </View>
      </FadeIn>

      <Text style={styles.listTitle}>Altre in focus</Text>
      {rest.map((m) => {
        const top =
          m.consensus.home >= m.consensus.draw && m.consensus.home >= m.consensus.away
            ? '1'
            : m.consensus.away > m.consensus.draw
              ? '2'
              : 'X';
        const pct = Math.round(
          (top === '1' ? m.consensus.home : top === '2' ? m.consensus.away : m.consensus.draw) *
            100,
        );
        return (
          <View key={m.matchId} style={styles.listRow}>
            <View style={styles.listMain}>
              <Text style={styles.listMatch}>
                {m.home} – {m.away}
              </Text>
              <Text style={styles.listMeta}>{m.kickoffLabel}</Text>
            </View>
            <Text style={styles.listTip}>
              {top} · {pct}%
            </Text>
          </View>
        );
      })}

      <Text style={styles.disclaimer}>
        Non è un consiglio di scommessa. Le barre riflettono il mercato (mock fino
        a P4).
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
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  featuredComp: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  featuredMatch: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
  },
  featuredKick: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSoft,
  },
  bars: {
    marginTop: spacing.sm,
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
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    gap: spacing.md,
  },
  listMain: { flex: 1, gap: 2 },
  listMatch: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.text,
  },
  listMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  listTip: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.lime,
  },
  disclaimer: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
