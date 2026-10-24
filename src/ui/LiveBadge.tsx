import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, spacing } from './theme';

type LiveBadgeProps = {
  minute?: number;
};

/** Pulsing LIVE indicator (Reanimated). */
export function LiveBadge({ minute }: LiveBadgeProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.25, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={styles.badge}>
      <Animated.View style={[styles.dot, dotStyle]} />
      <Text style={styles.label}>LIVE</Text>
      {minute != null ? <Text style={styles.minute}>{minute}'</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.limeDim,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lime,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.lime,
  },
  minute: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    color: colors.lime,
  },
});
