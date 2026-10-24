import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  hasApiFootballKey,
  hasFootballDataKey,
  hasOddsApiKey,
} from '@/src/config/env';
import { PressableScale } from '@/src/ui/PressableScale';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

function KeyStatus({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.status, ok ? styles.ok : styles.missing]}>
        {ok ? 'ok' : '—'}
      </Text>
    </View>
  );
}

export function SettingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Impostazioni</Text>

      <PressableScale
        onPress={() => router.push('/storico')}
        style={styles.roadmapLink}
        scaleTo={0.98}
        accessibilityRole="button">
        <View>
          <Text style={styles.roadmapTitle}>Storico</Text>
          <Text style={styles.roadmapSub}>DB locale · risultati passati</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </PressableScale>

      <PressableScale
        onPress={() => router.push('/roadmap')}
        style={styles.roadmapLink}
        scaleTo={0.98}
        accessibilityRole="button">
        <View>
          <Text style={styles.roadmapTitle}>Roadmap</Text>
          <Text style={styles.roadmapSub}>Fasi prodotto · fatto e prossimo</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </PressableScale>

      <Text style={styles.section}>API</Text>
      <KeyStatus label="football-data.org" ok={hasFootballDataKey()} />
      <KeyStatus label="API-Football" ok={hasApiFootballKey()} />
      <KeyStatus label="The Odds API" ok={hasOddsApiKey()} />

      <Text style={styles.disclaimer}>
        Informazioni sportive e lettura del mercato. Non è consulenza sulle
        scommesse.
      </Text>
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
  roadmapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.limeLine,
    gap: spacing.md,
  },
  roadmapTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.lime,
  },
  roadmapSub: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  chev: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.lime,
  },
  section: {
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
  disclaimer: {
    marginTop: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
