import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTeamStats, listTeams } from '@/src/data/history/catalog';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { ScreenHeader } from '@/src/ui/ScreenHeader';
import { StaggerItem } from '@/src/ui/StaggerItem';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';
import { layout } from '@/src/ui/tokens';

export function TeamsScreen() {
  const teams = listTeams();
  return (
    <Screen>
      <ScreenHeader title="Squadre" subtitle={`${teams.length} nello storico locale`} />
      {teams.map((t, index) => {
        const stats = getTeamStats(t.id, 5);
        return (
          <StaggerItem key={t.id} index={index}>
            <Link href={`/team/${t.id}`} asChild>
              <PressableScale style={styles.row} scaleTo={0.98}>
                <TeamCrest
                  uri={t.crestUrl}
                  name={t.name}
                  size={layout.crestMd}
                  delay={40 + index * 20}
                />
                <View style={styles.meta}>
                  <Text style={styles.name}>{t.name}</Text>
                  <View style={styles.formRow}>
                    {stats.form.map((r, i) => (
                      <View
                        key={`${r}-${i}`}
                        style={[
                          styles.dot,
                          r === 'V' && styles.dotWin,
                          r === 'N' && styles.dotDraw,
                          r === 'P' && styles.dotLoss,
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.chev}>›</Text>
              </PressableScale>
            </Link>
          </StaggerItem>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: layout.cardPad,
    marginBottom: layout.rowGap,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  meta: { flex: 1, gap: 6, minWidth: 0 },
  name: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.text,
  },
  formRow: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.charcoal,
  },
  dotWin: { backgroundColor: colors.lime },
  dotDraw: { backgroundColor: colors.textMuted },
  dotLoss: { backgroundColor: colors.danger },
  chev: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.textMuted,
  },
});
