import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { durations } from './motion';
import { colors, fonts, spacing } from './theme';

type OddsBarProps = {
  label: string;
  value: number;
  odds?: number;
  delay?: number;
  emphasize?: boolean;
};

/** Animated probability bar (Reanimated width). */
export function OddsBar({
  label,
  value,
  odds,
  delay = 0,
  emphasize = false,
}: OddsBarProps) {
  const progress = useSharedValue(0);
  const pct = Math.round(value * 100);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(Math.max(0, Math.min(1, value)), {
        duration: durations.bar,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [delay, progress, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

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
          style={[styles.fill, emphasize ? styles.fillHot : null, fillStyle]}
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
