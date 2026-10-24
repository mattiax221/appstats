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
      <Text style={[styles.status, ok ? styles.ok : styles.missing]}>
        {ok ? 'ok' : 'assente'}
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
        Chiavi EXPO_PUBLIC_* per il prototipo. Attribution e disclaimer restano
        qui.
      </Text>

      <Text style={styles.section}>API keys</Text>
      <KeyStatus label="football-data.org" ok={hasFootballDataKey()} />
      <KeyStatus label="API-Football" ok={hasApiFootballKey()} />
      <KeyStatus label="The Odds API" ok={hasOddsApiKey()} />

      <Text style={styles.section}>Attribution</Text>
      <Text style={styles.sources}>
        football-data.org · API-Football · The Odds API. Rispetta i rate limit
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
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
  status: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ok: { color: colors.lime },
  missing: { color: colors.textMuted },
  sources: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSoft,
  },
  disclaimer: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
