import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { durations, useNativeDriver } from './motion';
import { colors, fonts, spacing } from './theme';

type BrandMarkProps = {
  size?: 'hero' | 'compact';
};

export function BrandMark({ size = 'hero' }: BrandMarkProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const lineScale = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durations.enter,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durations.enter,
        useNativeDriver,
      }),
      Animated.spring(lineScale, {
        toValue: 1,
        friction: 8,
        tension: 55,
        useNativeDriver,
      }),
    ]).start();
  }, [lineScale, opacity, translateY]);

  const isHero = size === 'hero';

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Text
        accessibilityRole="header"
        style={[styles.brand, isHero ? styles.brandHero : styles.brandCompact]}>
        AppStats
      </Text>
      <Animated.View
        style={[
          styles.line,
          isHero ? styles.lineHero : styles.lineCompact,
          { transform: [{ scaleX: lineScale }] },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontFamily: fonts.brand,
    color: colors.text,
    letterSpacing: 2,
  },
  brandHero: {
    fontSize: 72,
    lineHeight: 74,
  },
  brandCompact: {
    fontSize: 30,
    lineHeight: 34,
  },
  line: {
    height: 3,
    backgroundColor: colors.lime,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  lineHero: { width: 88 },
  lineCompact: { width: 44 },
});
