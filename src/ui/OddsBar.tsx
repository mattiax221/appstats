import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { durations } from './motion';
import { colors, fonts, spacing } from './theme';

type OddsBarProps = {
  label: string;
  /** 0–1 normalized probability (stima or consensus). */
  value: number;
  /** Decimal bookmaker odds — omit when no Odds API key / no market. */
  odds?: number;
  delay?: number;
  emphasize?: boolean;
};

/** Probability bar — width fills on enter (motion #3). */
export function OddsBar({
  label,
  value,
  odds,
  delay = 0,
  emphasize = false,
}: OddsBarProps) {
  const width = useRef(new Animated.Value(0)).current;
  const pct = Math.round(value * 100);

  useEffect(() => {
    Animated.timing(width, {
      toValue: value,
      duration: durations.bar,
      delay,
      useNativeDriver: false, // layout width can't use native driver
    }).start();
  }, [delay, value, width]);

  const barWidth = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        <Text style={[styles.label, emphasize && styles.labelHot]}>{label}</Text>
        <Text style={styles.pct}>{pct}%</Text>
        {odds != null ? (
          <Text style={styles.odds}>{odds.toFixed(2)}</Text>
        ) : (
          <Text style={styles.odds}>—</Text>
        )}
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            emphasize ? styles.fillHot : null,
            { width: barWidth },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textSoft,
    width: 28,
  },
  labelHot: { color: colors.lime },
  pct: {
    flex: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  odds: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  track: {
    height: 8,
    backgroundColor: colors.limeDim,
    overflow: 'hidden',
    borderRadius: 4,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.textSoft,
    borderRadius: 4,
  },
  fillHot: {
    backgroundColor: colors.lime,
  },
});
