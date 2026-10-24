import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockFavoriteTeams } from '@/src/data/mock/fixtures';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function FavoritesScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>Preferiti</Text>
      <Text style={styles.title}>Le tue squadre</Text>
      <Text style={styles.body}>
        Home e quote orientate su ciò che segui — meno chiamate API, più
        segnale.
      </Text>

      {mockFavoriteTeams.map((team, index) => (
        <StaggerItem key={team.id} index={index}>
          <Link href={`/team/${team.id}`} asChild>
            <PressableScale style={styles.row} scaleTo={0.98}>
              <TeamCrest uri={team.crestUrl} name={team.name} size={44} />
              <View style={styles.meta}>
                <Text style={styles.name}>{team.name}</Text>
                <Text style={styles.comp}>{team.competition}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </PressableScale>
          </Link>
        </StaggerItem>
      ))}

      <Text style={styles.hint}>
        Persistenza locale in P3. Crest da CDN demo.
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
    marginBottom: spacing.lg,
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
  meta: { flex: 1, gap: 2 },
  name: {
    fontFamily: fonts.bodySemi,
    fontSize: 17,
    color: colors.text,
  },
  comp: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  chev: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.textMuted,
  },
  hint: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
