import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function FavoritesScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>Preferiti</Text>
      <Text style={styles.title}>Le tue squadre</Text>
      <Text style={styles.body}>
        Segui squadre e competizioni per una Home più leggera sui rate limit.
        Persistenza locale in P3.
      </Text>
      <Text style={styles.empty}>Nessun preferito ancora.</Text>
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
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 360,
  },
  empty: {
    marginTop: spacing.xl,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
});
