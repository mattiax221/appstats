import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { hasFootballDataKey } from '@/src/config/env';
import { useFavorites } from '@/src/data/favorites/useFavorites';
import {
  getCatalog,
  getTeam,
  listRecentMatches,
  toHistoryRow,
} from '@/src/data/history/catalog';
import { leagueFilters } from '@/src/data/mock/fixtures';
import { ApiKeyEmptyState } from '@/src/ui/ApiKeyEmptyState';
import { BrandMark } from '@/src/ui/BrandMark';
import { FilterChip } from '@/src/ui/Chip';
import { MatchRow } from '@/src/ui/MatchRow';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

import { useHomeFixtures } from './useHomeFixtures';

export function HomeScreen() {
  const [league, setLeague] = useState<string>('all');
  const hasKey = hasFootballDataKey();
  const fav = useFavorites();
  const { data, isLoading, isError, error, refetch, isFetching } = useHomeFixtures();

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (league === 'all') return list;
    return list.filter((m) => m.competitionId === league);
  }, [data, league]);

  const live = filtered.filter((m) => m.status === 'live');
  const upcoming = filtered.filter((m) => m.status !== 'live');
  const standingsCode = league === 'all' ? 'SA' : league;

  const favTeams = fav.teamIds.map((id) => getTeam(id)).filter(Boolean);

  const favHistory = useMemo(() => {
    if (!fav.teamIds.length && !fav.competitionCodes.length) return [];
    const cat = getCatalog();
    const teamSet = new Set(fav.teamIds);
    const compCodes = new Set(fav.competitionCodes);
    const compIds = new Set(
      [...cat.competitions.values()]
        .filter((c) => compCodes.has(c.code))
        .map((c) => c.id),
    );
    return [...cat.matches]
      .filter((m) => {
        const teamHit = teamSet.has(m.homeTeamId) || teamSet.has(m.awayTeamId);
        const compHit = compIds.size > 0 && compIds.has(m.competitionId);
        if (teamSet.size && compIds.size) return teamHit || compHit;
        if (teamSet.size) return teamHit;
        return compHit;
      })
      .sort((a, b) => b.matchDate.localeCompare(a.matchDate))
      .slice(0, 12)
      .map(toHistoryRow);
  }, [fav.teamIds, fav.competitionCodes]);

  const historyRows = favHistory.length > 0 ? favHistory : listRecentMatches(8);
  const historyTitle =
    favHistory.length > 0 ? 'Preferiti · storico' : 'Storico recente';

  return (
    <Screen>
      <View style={styles.hero}>
        <BrandMark size="hero" />
      </View>

      <View style={styles.pitchBand} accessibilityElementsHidden>
        <View style={styles.pitchBandInner} />
        <View style={styles.pitchCircle} />
      </View>

      <View style={styles.filters}>
        {leagueFilters.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            crestUrl={'crestUrl' in f ? f.crestUrl : undefined}
            selected={league === f.id}
            onPress={() => setLeague(f.id)}
          />
        ))}
      </View>

      <View style={styles.quickLinks}>
        {hasKey ? (
          <PressableScale
            onPress={() => router.push(`/standings/${standingsCode}`)}
            style={styles.classifica}
            scaleTo={0.98}>
            <Text style={styles.classificaLabel}>Classifica · {standingsCode}</Text>
            <Text style={styles.chev}>›</Text>
          </PressableScale>
        ) : null}
        <PressableScale
          onPress={() => router.push('/storico')}
          style={styles.classifica}
          scaleTo={0.98}>
          <Text style={styles.classificaLabel}>Storico</Text>
          <Text style={styles.chev}>›</Text>
        </PressableScale>
        <PressableScale
          onPress={() => router.push('/squadre')}
          style={styles.classifica}
          scaleTo={0.98}>
          <Text style={styles.classificaLabel}>Squadre · stats</Text>
          <Text style={styles.chev}>›</Text>
        </PressableScale>
      </View>

      {favTeams.length > 0 ? (
        <>
          <SectionHeader title="Le tue squadre" />
          <View style={styles.favRow}>
            {favTeams.map((t) =>
              t ? (
                <Link key={t.id} href={`/team/${t.id}`} asChild>
                  <PressableScale style={styles.favChip} scaleTo={0.96}>
                    <TeamCrest uri={t.crestUrl} name={t.name} size={28} delay={40} />
                    <Text style={styles.favName} numberOfLines={1}>
                      {t.name}
                    </Text>
                  </PressableScale>
                </Link>
              ) : null,
            )}
          </View>
        </>
      ) : null}

      <SectionHeader title={historyTitle} />
      {historyRows.map((m, index) => (
        <StaggerItem key={m.id} index={Math.min(index, 10)}>
          <Link href={`/match/h-${m.id}`} asChild>
            <PressableScale style={styles.histRow} scaleTo={0.98}>
              <Text style={styles.histDate}>{m.matchDate}</Text>
              <View style={styles.histTeams}>
                <TeamCrest uri={m.homeCrest} name={m.homeName} size={24} delay={30} />
                <Text style={styles.histScore}>
                  {m.homeGoals}:{m.awayGoals}
                </Text>
                <TeamCrest uri={m.awayCrest} name={m.awayName} size={24} delay={50} />
              </View>
              <Text style={styles.histNames} numberOfLines={1}>
                {m.homeName} – {m.awayName}
              </Text>
            </PressableScale>
          </Link>
        </StaggerItem>
      ))}

      {!hasKey ? <ApiKeyEmptyState /> : null}

      {hasKey && isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.lime} />
        </View>
      ) : null}

      {hasKey && isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Errore API: {error instanceof Error ? error.message.slice(0, 120) : 'sconosciuto'}
          </Text>
          <PressableScale onPress={() => refetch()} style={styles.retry}>
            <Text style={styles.retryText}>{isFetching ? '…' : 'Riprova'}</Text>
          </PressableScale>
        </View>
      ) : null}

      {hasKey && !isLoading && !isError ? (
        <>
          {live.length > 0 ? (
            <>
              <SectionHeader title="Live" />
              {live.map((match, index) => (
                <StaggerItem key={match.id} index={index}>
                  <MatchRow match={match} enterDelay={80 + index * 40} />
                </StaggerItem>
              ))}
            </>
          ) : null}

          <SectionHeader title="Prossime" />
          {upcoming.length === 0 ? (
            <Text style={styles.empty}>Nessuna partita in questo periodo</Text>
          ) : (
            upcoming.map((match, index) => (
              <StaggerItem key={match.id} index={live.length + index}>
                <MatchRow
                  match={match}
                  enterDelay={120 + (live.length + index) * 45}
                />
              </StaggerItem>
            ))
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  pitchBand: {
    height: 72,
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.pitch,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pitchBandInner: {
    height: 2,
    backgroundColor: 'rgba(244, 247, 241, 0.35)',
    marginHorizontal: spacing.xl,
  },
  pitchCircle: {
    position: 'absolute',
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(244, 247, 241, 0.28)',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  quickLinks: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  classifica: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.limeLine,
  },
  classificaLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.lime,
  },
  chev: {
    fontFamily: fonts.body,
    fontSize: 20,
    color: colors.lime,
  },
  favRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  favChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.limeLine,
    maxWidth: '48%',
  },
  favName: {
    flexShrink: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.text,
  },
  histRow: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: 4,
  },
  histDate: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  histTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  histScore: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  histNames: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
  center: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    paddingVertical: spacing.md,
  },
  errorBox: {
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.danger,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.limeDim,
  },
  retryText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.lime,
  },
});
