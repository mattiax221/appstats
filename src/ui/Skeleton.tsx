import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing } from './theme';
import { layout } from './tokens';

export function SkeletonBlock({
  height = 14,
  width = '100%',
  style,
}: {
  height?: number;
  width?: number | `${number}%`;
  style?: object;
}) {
  const opacity = useSharedValue(0.35);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.75, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [opacity]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        styles.block,
        { height, width: width as number | `${number}%` },
        anim,
        style,
      ]}
    />
  );
}

export function SkeletonMatchCard() {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <SkeletonBlock height={12} width={72} />
        <SkeletonBlock height={12} width={64} />
      </View>
      <View style={styles.body}>
        <SkeletonBlock height={40} width={40} style={styles.circle} />
        <SkeletonBlock height={22} width={48} />
        <SkeletonBlock height={40} width={40} style={styles.circle} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={{ gap: layout.rowGap }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMatchCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.charcoal,
    borderRadius: radii.sm,
  },
  card: {
    padding: layout.cardPad,
    backgroundColor: colors.nightLift,
    borderRadius: layout.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  circle: { borderRadius: 10 },
});
