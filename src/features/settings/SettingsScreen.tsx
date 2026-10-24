import { StyleSheet, Text, View } from 'react-native';

import {
  hasApiFootballKey,
  hasFootballDataKey,
  hasOddsApiKey,
} from '@/src/config/env';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

function KeyStatus({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.badge, ok ? styles.badgeOk : styles.badgeMissing]}>
        {ok ? 'configurata' : 'mancante'}
      </Text>
    </View>
  );
}

export function SettingsScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>Impostazioni</Text>
      <Text style={styles.title}>Fonti e limiti</Text>
      <Text style={styles.body}>
        Chiavi via variabili EXPO_PUBLIC_* (prototipo). Attribution e disclaimer
        restano in app.
      </Text>

      <View style={styles.section}>
        <KeyStatus label="football-data.org" ok={hasFootballDataKey()} />
        <KeyStatus label="API-Football" ok={hasApiFootballKey()} />
        <KeyStatus label="The Odds API" ok={hasOddsApiKey()} />
      </View>

      <Text style={styles.sources}>
        Fonti: football-data.org · API-Football · The Odds API. Rispetta i limiti
        del piano free.
      </Text>
      <Text style={styles.disclaimer}>
        AppStats fornisce informazioni sportive e una lettura delle quote. Non è
        consulenza sulle scommesse.
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
  section: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
  badge: {
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  badgeOk: { color: colors.pitchLine },
  badgeMissing: { color: colors.textMuted },
  sources: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  disclaimer: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
