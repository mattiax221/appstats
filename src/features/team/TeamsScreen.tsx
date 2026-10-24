import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { listTeams } from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function TeamsScreen() {
  const teams = listTeams();
  return (
    <Screen>
      <Text style={styles.title}>Squadre</Text>
      <Text style={styles.sub}>{teams.length} nello storico locale</Text>
      {teams.map((t, index) => (
        <StaggerItem key={t.id} index={Math.min(index, 14)}>
          <Link href={`/team/${t.id}`} asChild>
            <PressableScale style={styles.row} scaleTo={0.98}>
              <TeamCrest uri={t.crestUrl} name={t.name} size={40} delay={40} />
              <Text style={styles.name}>{t.name}</Text>
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
  },
  sub: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  name: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.text,
  },
  chev: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.textMuted,
  },
});
