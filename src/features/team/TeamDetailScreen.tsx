import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockFavoriteTeams } from '@/src/data/mock/fixtures';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = mockFavoriteTeams.find((t) => t.id === id);
  const name = team?.name ?? (typeof id === 'string' ? id : 'Squadra');

  return (
    <Screen>
      <Text style={styles.kicker}>Squadra</Text>
      <Text style={styles.title}>{name}</Text>
      {team ? <Text style={styles.comp}>{team.competition}</Text> : null}

      <View style={styles.formRow}>
        {['V', 'V', 'N', 'P', 'V'].map((r, i) => (
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
      <Text style={styles.formLabel}>Forma recente · mock</Text>

      <View style={styles.divider} />
      <Text style={styles.body}>
        GF/GS, casa/trasferta e classifica arrivano in P2. Qui solo shell UI.
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
    fontSize: 56,
    lineHeight: 58,
    color: colors.text,
    letterSpacing: 1,
  },
  comp: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  formCell: {
    width: 36,
    height: 36,
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
  formLabel: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  divider: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
});
