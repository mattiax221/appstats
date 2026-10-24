import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/src/data/favorites/useFavorites';
import {
  getTeam,
  getTeamStats,
  listTeamMatches,
  parseTeamParam,
} from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = parseTeamParam(typeof id === 'string' ? id : undefined);
  const team = teamId != null ? getTeam(teamId) : null;
  const fav = useFavorites();
  const stats = useMemo(
    () => (teamId != null ? getTeamStats(teamId, 10) : null),
    [teamId],
  );
  const recent = useMemo(
    () => (teamId != null ? listTeamMatches(teamId, 12) : []),
    [teamId],
  );
  const isFav = teamId != null && fav.isTeamFavorite(teamId);

  if (!team || !stats) {
    return (
      <Screen>
        <Text style={styles.missing}>Squadra non trovata nello storico</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <TeamCrest uri={team.crestUrl} name={team.name} size={72} delay={60} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{team.name}</Text>
          <Text style={styles.comp}>Ultime {stats.played} partite</Text>
        </View>
        <PressableScale
          onPress={() => void fav.toggleTeam(team.id)}
          style={styles.favBtn}
          scaleTo={0.9}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}>
          <Text style={[styles.favStar, isFav && styles.favStarOn]}>{isFav ? '★' : '☆'}</Text>
        </PressableScale>
      </View>

      <View style={styles.formRow}>
        {stats.form.map((r, i) => (
          <View
            key={`${r}-${i}`}
            style={[
              styles.formCell,
              r === 'V' && styles.formWin,
              r === 'N' && styles.formDraw,
              r === 'P' && styles.formLoss,
            ]}>
            <Text style={styles.formText}>{r}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statGrid}>
        <Stat label="V" value={String(stats.wins)} />
        <Stat label="N" value={String(stats.draws)} />
        <Stat label="P" value={String(stats.losses)} />
        <Stat label="GF" value={String(stats.goalsFor)} />
        <Stat label="GS" value={String(stats.goalsAgainst)} />
        <Stat label="Diff" value={String(stats.goalsFor - stats.goalsAgainst)} />
      </View>

      <SectionHeader title="Recenti" />
      {recent.map((m, index) => (
        <StaggerItem key={m.id} index={Math.min(index, 10)}>
          <Link href={`/match/h-${m.id}`} asChild>
            <PressableScale style={styles.row} scaleTo={0.98}>
              <Text style={styles.date}>{m.matchDate}</Text>
              <Text style={styles.compCode}>{m.competitionCode}</Text>
              <View style={styles.teams}>
                <TeamCrest uri={m.homeCrest} name={m.homeName} size={26} delay={30} />
                <Text style={styles.score}>
                  {m.homeGoals}:{m.awayGoals}
                </Text>
                <TeamCrest uri={m.awayCrest} name={m.awayName} size={26} delay={50} />
              </View>
              <Text style={styles.names} numberOfLines={1}>
                {m.homeName} – {m.awayName}
              </Text>
            </PressableScale>
          </Link>
        </StaggerItem>
      ))}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1, gap: 4 },
  favBtn: { padding: spacing.sm },
  favStar: { fontSize: 28, color: colors.textMuted },
  favStarOn: { color: colors.lime },
  title: {
    fontFamily: fonts.brand,
    fontSize: 40,
    lineHeight: 42,
    color: colors.text,
    letterSpacing: 1,
  },
  comp: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  formCell: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal,
  },
  formWin: { backgroundColor: colors.pitchLit },
  formDraw: { backgroundColor: colors.charcoal },
  formLoss: { backgroundColor: 'rgba(255, 92, 77, 0.35)' },
  formText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stat: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.lime,
  },
  statLabel: {
    marginTop: 2,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  row: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: 4,
  },
  date: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
  compCode: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.lime,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  score: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
    minWidth: 44,
    textAlign: 'center',
  },
  names: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSoft,
  },
});
