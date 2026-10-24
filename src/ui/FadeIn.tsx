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
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durations.enter,
        delay,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durations.enter,
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
