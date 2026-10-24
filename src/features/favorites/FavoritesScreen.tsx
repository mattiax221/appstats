import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { mockFavoriteTeams } from '@/src/data/mock/fixtures';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
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
            <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              <View style={styles.mark}>
                <Text style={styles.markText}>{team.name.slice(0, 3).toUpperCase()}</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.name}>{team.name}</Text>
                <Text style={styles.comp}>{team.competition}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          </Link>
        </StaggerItem>
      ))}

      <Text style={styles.hint}>
        Persistenza locale in P3. Questa lista è mock di design.
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    gap: spacing.md,
  },
  pressed: { opacity: 0.7 },
  mark: {
    width: 44,
    height: 44,
    backgroundColor: colors.pitch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.lime,
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
