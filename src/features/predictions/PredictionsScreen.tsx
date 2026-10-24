import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

/** Stub: P4 will wire The Odds API + probabilità implicite. */
export function PredictionsScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>Previsioni</Text>
      <Text style={styles.title}>Lettura del mercato</Text>
      <Text style={styles.body}>
        Qui arriveranno probabilità 1X2 derivate dalle quote bookmaker (consenso,
        range, value informativo). Nessun modello ML in v1.
      </Text>

      <View style={styles.stub}>
        <Text style={styles.stubLabel}>In arrivo · P4</Text>
        <Text style={styles.stubDetail}>
          The Odds API · budget ~500 req/mese · solo match in focus
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Non è un consiglio di scommessa. Le previsioni riflettono il mercato, non
        una garanzia di risultato.
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
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 360,
  },
  stub: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  stubLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.pitchLine,
  },
  stubDetail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  disclaimer: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
