import { type ReactNode, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { durations } from './motion';

type StaggerItemProps = {
  children: ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};

/** List stagger via Reanimated — every row arrives a beat after the previous. */
export function StaggerItem({ children, index, style }: StaggerItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    const delay = 80 + Math.min(index, 16) * durations.stagger;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
  }, [index, opacity, translateY]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}
