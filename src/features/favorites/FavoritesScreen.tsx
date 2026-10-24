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
      <Text style={styles.title}>Preferiti</Text>

      {mockFavoriteTeams.map((team, index) => (
        <StaggerItem key={team.id} index={index}>
          <Link href={`/team/${team.id}`} asChild>
            <PressableScale style={styles.row} scaleTo={0.98}>
              <TeamCrest
                uri={team.crestUrl}
                name={team.name}
                size={44}
                delay={80 + index * 50}
              />
              <View style={styles.meta}>
                <Text style={styles.name}>{team.name}</Text>
                <Text style={styles.comp}>{team.competition}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </PressableScale>
          </Link>
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
});
