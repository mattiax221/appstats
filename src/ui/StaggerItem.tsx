import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

import { durations, useNativeDriver } from './motion';

type StaggerItemProps = {
  children: ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};

/** List stagger — each row arrives a beat after the previous. */
export function StaggerItem({ children, index, style }: StaggerItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const delay = 120 + index * durations.stagger;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay,
        useNativeDriver,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
