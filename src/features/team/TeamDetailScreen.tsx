import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Text style={styles.kicker}>Squadra</Text>
      <Text style={styles.title}>Profilo</Text>
      <Text style={styles.meta}>id · {id ?? '—'}</Text>
      <Text style={styles.body}>
        Placeholder: forma, GF/GS, casa/trasferta e classifica in P2.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.amber,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.brand,
    fontSize: 40,
    lineHeight: 44,
    color: colors.text,
  },
  meta: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.pitchLine,
  },
  body: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
});
