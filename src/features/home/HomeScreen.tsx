import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '@/src/ui/BrandMark';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function HomeScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      delay: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fade]);

  return (
    <Screen>
      <BrandMark size="hero" />

      <Animated.View style={[styles.block, { opacity: fade }]}>
        <Text style={styles.headline}>Cosa c’è in campo oggi</Text>
        <Text style={styles.support}>
          Giornata, forma e lettura del mercato — in un’unica app.
        </Text>

        <View style={styles.ctaRow}>
          <Link href="/match/demo" asChild>
            <Pressable style={({ pressed }) => [styles.ctaPrimary, pressed && styles.pressed]}>
              <Text style={styles.ctaPrimaryLabel}>Apri partita demo</Text>
            </Pressable>
          </Link>
          <Link href="/team/demo" asChild>
            <Pressable style={({ pressed }) => [styles.ctaGhost, pressed && styles.pressed]}>
              <Text style={styles.ctaGhostLabel}>Scheda squadra</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>

      <View style={styles.pitchStrip} accessibilityElementsHidden>
        <View style={styles.pitchInner} />
      </View>

      <Text style={styles.hint}>
        Le partite live e le classifiche arriveranno in P1 (football-data.org).
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  headline: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
    maxWidth: 320,
  },
  support: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 340,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ctaPrimary: {
    backgroundColor: colors.pitchLine,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  ctaPrimaryLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.bg,
    letterSpacing: 0.2,
  },
  ctaGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  ctaGhostLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  pressed: { opacity: 0.75 },
  pitchStrip: {
    marginTop: spacing.xxl,
    height: 120,
    backgroundColor: colors.pitch,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pitchInner: {
    height: 2,
    backgroundColor: 'rgba(242, 247, 240, 0.35)',
    marginHorizontal: spacing.lg,
  },
  hint: {
    marginTop: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
