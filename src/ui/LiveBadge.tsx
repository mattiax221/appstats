import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useNativeDriver } from './motion';
import { colors, fonts, spacing } from './theme';

type LiveBadgeProps = {
  minute?: number;
};

/** Pulsing LIVE indicator. */
export function LiveBadge({ minute }: LiveBadgeProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.badge}>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
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
