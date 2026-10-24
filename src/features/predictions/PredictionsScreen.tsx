import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { hasOddsApiKey } from '@/src/config/env';
import { oddsApiAdapter } from '@/src/data/adapters/odds-api';
import { useFavorites } from '@/src/data/favorites/useFavorites';
import { competitionBadgeUrl } from '@/src/data/history/catalog';
import { listHistoryPredictions, valueEdges } from '@/src/data/history/predict';
import { FadeIn } from '@/src/ui/FadeIn';
import { OddsBar } from '@/src/ui/OddsBar';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { ScreenHeader } from '@/src/ui/ScreenHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';
import { layout } from '@/src/ui/tokens';

export function PredictionsScreen() {
  const fav = useFavorites();
  const predictions = useMemo(
    () => listHistoryPredictions({ favoriteTeamIds: fav.teamIds, limit: 10 }),
    [fav.teamIds],
  );
  const featured = predictions[0];
  const rest = predictions.slice(1);
  const withOdds = hasOddsApiKey();
  const badge = featured ? competitionBadgeUrl(featured.competitionCode) : null;

  const oddsQuery = useQuery({
    queryKey: ['odds-h2h', featured?.homeName, featured?.awayName],
    enabled: withOdds && Boolean(featured),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!featured) return null;
      return oddsApiAdapter.getH2HOdds(featured.homeName, featured.awayName);
    },
  });

  const book = oddsQuery.data;
  const edges =
    featured && book
      ? valueEdges(featured.estimate, {
          home: book.home,
          draw: book.draw,
          away: book.away,
        })
      : null;

  return (
    <Screen>
      <ScreenHeader title="Previsioni" subtitle="Stima 1X2 dallo storico locale" />

      {featured ? (
        <FadeIn delay={60} style={styles.featured}>
          <View style={styles.featuredTop}>
            <View style={styles.comp}>
              {badge ? (
                <Image source={{ uri: badge }} style={styles.badge} resizeMode="contain" />
              ) : null}
              <Text style={styles.compCode}>{featured.competitionCode || 'H2H'}</Text>
            </View>
            <Text style={styles.stimaBadge}>{featured.label}</Text>
          </View>

          <View style={styles.teamsRow}>
            <View style={styles.teamBlock}>
              <TeamCrest
                uri={featured.homeCrest}
                name={featured.homeName}
                size={layout.crestLg}
                delay={100}
              />
              <Text style={styles.teamName}>{featured.homeName}</Text>
            </View>
            <Text style={styles.vs}>vs</Text>
            <View style={styles.teamBlock}>
              <TeamCrest
                uri={featured.awayCrest}
                name={featured.awayName}
                size={layout.crestLg}
                delay={140}
              />
              <Text style={styles.teamName}>{featured.awayName}</Text>
            </View>
          </View>

          <OddsBar
            label="1"
            value={featured.estimate.home}
            odds={book?.home}
            delay={180}
            emphasize={featured.tip === '1'}
          />
          <OddsBar
            label="X"
            value={featured.estimate.draw}
            odds={book?.draw}
            delay={260}
            emphasize={featured.tip === 'X'}
          />
          <OddsBar
            label="2"
            value={featured.estimate.away}
            odds={book?.away}
            delay={340}
            emphasize={featured.tip === '2'}
          />

          {book && edges ? (
            <Text style={styles.valueLine}>
              Quote {book.bookmaker}: value 1 {fmtEdge(edges.home)} · X {fmtEdge(edges.draw)} · 2{' '}
              {fmtEdge(edges.away)}
            </Text>
          ) : withOdds ? (
            <Text style={styles.meta}>Quote bookmaker: caricamento o non trovate</Text>
          ) : (
            <Text style={styles.meta}>
              Senza Odds API: solo stima storico (niente quote inventate)
            </Text>
          )}
        </FadeIn>
      ) : null}

      <Text style={styles.listTitle}>Altre stime</Text>
      {rest.map((m, i) => {
        const rowBadge = competitionBadgeUrl(m.competitionCode);
        return (
          <StaggerItem key={m.id} index={i}>
            <PressableScale
              onPress={() => router.push(`/team/${m.homeTeamId}`)}
              style={styles.listRow}
              scaleTo={0.98}>
              <TeamCrest uri={m.homeCrest} name={m.homeName} size={layout.crestSm + 4} delay={80} />
              <View style={styles.listMain}>
                <Text style={styles.listMatch}>
                  {m.homeName} – {m.awayName}
                </Text>
                <View style={styles.listMetaRow}>
                  {rowBadge ? (
                    <Image source={{ uri: rowBadge }} style={styles.miniBadge} resizeMode="contain" />
                  ) : null}
                  <Text style={styles.listMeta}>{m.label}</Text>
                </View>
              </View>
              <TeamCrest uri={m.awayCrest} name={m.awayName} size={layout.crestSm + 4} delay={100} />
              <Text style={styles.listTip}>
                {m.tip} · {Math.round(m.tipPct * 100)}%
              </Text>
            </PressableScale>
          </StaggerItem>
        );
      })}

      <Text style={styles.disclaimer}>
        Informazioni sportive e lettura del mercato. Non è consulenza sulle scommesse.
      </Text>
    </Screen>
  );
}

function fmtEdge(n: number) {
  const pct = Math.round(n * 100);
  return `${pct >= 0 ? '+' : ''}${pct}pp`;
}

const styles = StyleSheet.create({
  featured: {
    padding: layout.cardPad,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
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
  comp: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { width: 16, height: 16 },
  compCode: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.lime,
    textTransform: 'uppercase',
  },
  stimaBadge: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.lime,
    textTransform: 'uppercase',
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
  meta: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  valueLine: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textSoft,
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
    padding: layout.cardPad,
    marginBottom: layout.rowGap,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  listMain: { flex: 1, gap: 4, minWidth: 0 },
  listMatch: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.text,
  },
  listMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniBadge: { width: 12, height: 12 },
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
    marginBottom: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
