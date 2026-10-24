import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from './theme';

const useNativeDriver = Platform.OS !== 'web';

type BrandMarkProps = {
  /** Hero-scale on Home; compact elsewhere. */
  size?: 'hero' | 'compact';
};

export function BrandMark({ size = 'hero' }: BrandMarkProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const lineScale = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        useNativeDriver,
      }),
      Animated.spring(lineScale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver,
      }),
    ]).start();
  }, [lineScale, opacity, translateY]);

  const isHero = size === 'hero';

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Text style={[styles.brand, isHero ? styles.brandHero : styles.brandCompact]}>
        AppStats
      </Text>
      <Animated.View
        style={[
          styles.line,
          isHero ? styles.lineHero : styles.lineCompact,
          { transform: [{ scaleX: lineScale }] },
        ]}
      />
      {isHero ? (
        <View style={styles.tagRow}>
          <View style={styles.dot} />
          <Text style={styles.tag}>Calcio · Stats · Mercato</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontFamily: fonts.brand,
    color: colors.text,
    letterSpacing: 1.5,
  },
  brandHero: {
    fontSize: 64,
    lineHeight: 68,
  },
  brandCompact: {
    fontSize: 28,
    lineHeight: 32,
  },
  line: {
    height: 3,
    backgroundColor: colors.pitchLine,
    marginTop: spacing.sm,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  lineHero: { width: 72 },
  lineCompact: { width: 40 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
  },
  tag: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
});
