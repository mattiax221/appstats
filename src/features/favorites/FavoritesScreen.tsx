import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/src/data/favorites/useFavorites';
import { getTeam, listCompetitions, listTeams } from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function FavoritesScreen() {
  const fav = useFavorites();
  const teams = fav.teamIds.map((id) => getTeam(id)).filter(Boolean);
  const comps = listCompetitions().filter((c) => fav.competitionCodes.includes(c.code));
  const suggestions = listTeams()
    .filter((t) => !fav.teamIds.includes(t.id))
    .slice(0, 8);

  return (
    <Screen>
      <Text style={styles.title}>Preferiti</Text>
      <Text style={styles.sub}>Sul dispositivo · senza account</Text>

      <SectionHeader title="Campionati" />
      <View style={styles.chipRow}>
        {listCompetitions().map((c) => {
          const on = fav.isCompetitionFavorite(c.code);
          return (
            <PressableScale
              key={c.code}
              onPress={() => void fav.toggleCompetition(c.code)}
              style={[styles.chip, on && styles.chipOn]}
              scaleTo={0.97}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {on ? '★ ' : ''}
                {c.code}
              </Text>
            </PressableScale>
          );
        })}
      </View>
      {comps.length === 0 ? (
        <Text style={styles.hint}>Tocca SA o PL per seguirli in Home.</Text>
      ) : null}

      <SectionHeader title="Squadre" />
      {teams.length === 0 ? (
        <Text style={styles.hint}>Nessuna squadra ancora. Aggiungi dalle suggerite.</Text>
      ) : null}
      {teams.map((team, index) =>
        team ? (
          <StaggerItem key={team.id} index={index}>
            <Link href={`/team/${team.id}`} asChild>
              <PressableScale style={styles.row} scaleTo={0.98}>
                <TeamCrest uri={team.crestUrl} name={team.name} size={44} delay={60} />
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
            <TeamCrest uri={t.crestUrl} name={t.name} size={40} delay={40} />
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.starOff}>☆</Text>
          </PressableScale>
        </StaggerItem>
      ))}
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
  },
  sub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.nightLift,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  chipOn: {
    borderColor: colors.lime,
    backgroundColor: colors.limeDim,
  },
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
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
