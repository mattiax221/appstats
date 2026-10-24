import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

import { durations, useNativeDriver } from './motion';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Tab / screen enter — soft rise into place. */
export function FadeIn({ children, delay = 0, style }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durations.enter + 40,
        delay,
        useNativeDriver,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 70,
        delay,
        useNativeDriver,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
