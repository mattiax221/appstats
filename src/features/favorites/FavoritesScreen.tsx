import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/src/data/favorites/useFavorites';
import {
  competitionBadgeUrl,
  getTeam,
  listCompetitions,
  listTeams,
} from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { ScreenHeader } from '@/src/ui/ScreenHeader';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';
import { layout } from '@/src/ui/tokens';

export function FavoritesScreen() {
  const fav = useFavorites();
  const teams = fav.teamIds.map((id) => getTeam(id)).filter(Boolean);
  const suggestions = listTeams()
    .filter((t) => !fav.teamIds.includes(t.id))
    .slice(0, 10);

  return (
    <Screen>
      <ScreenHeader title="Preferiti" subtitle="Sul dispositivo · senza account" />

      <SectionHeader title="Campionati" />
      <View style={styles.chipRow}>
        {listCompetitions().map((c) => {
          const on = fav.isCompetitionFavorite(c.code);
          const badge = competitionBadgeUrl(c.code);
          return (
            <PressableScale
              key={c.code}
              onPress={() => void fav.toggleCompetition(c.code)}
              style={[styles.chip, on && styles.chipOn]}
              scaleTo={0.97}>
              {badge ? (
                <Image source={{ uri: badge }} style={styles.chipBadge} resizeMode="contain" />
              ) : null}
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {on ? '★ ' : ''}
                {c.name}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <SectionHeader title="Squadre" />
      {teams.length === 0 ? (
        <Text style={styles.hint}>Nessuna squadra ancora. Aggiungi dalle suggerite.</Text>
      ) : null}
      {teams.map((team, index) =>
        team ? (
          <StaggerItem key={team.id} index={index}>
            <Link href={`/team/${team.id}`} asChild>
              <PressableScale style={styles.row} scaleTo={0.98}>
                <TeamCrest uri={team.crestUrl} name={team.name} size={layout.crestMd} delay={40} />
                <Text style={styles.name}>{team.name}</Text>
                <PressableScale
                  onPress={() => void fav.toggleTeam(team.id)}
                  style={styles.starBtn}
                  scaleTo={0.9}>
                  <Text style={styles.starOn}>★</Text>
                </PressableScale>
              </PressableScale>
            </Link>
          </StaggerItem>
        ) : null,
      )}

      <SectionHeader title="Aggiungi" />
      {suggestions.map((t, index) => (
        <StaggerItem key={t.id} index={index}>
          <PressableScale
            style={styles.row}
            scaleTo={0.98}
            onPress={() => void fav.toggleTeam(t.id)}>
            <TeamCrest uri={t.crestUrl} name={t.name} size={layout.crestMd} delay={40} />
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.starOff}>☆</Text>
          </PressableScale>
        </StaggerItem>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.nightLift,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  chipOn: {
    borderColor: colors.lime,
    backgroundColor: colors.limeDim,
  },
  chipBadge: { width: 18, height: 18 },
  chipText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.textSoft,
  },
  chipTextOn: { color: colors.lime },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.cardPad,
    marginBottom: layout.rowGap,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  name: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.text,
  },
  starBtn: { padding: 6 },
  starOn: { fontSize: 22, color: colors.lime },
  starOff: { fontSize: 22, color: colors.textMuted },
});
