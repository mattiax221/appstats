import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { durations, useNativeDriver } from './motion';
import { colors, fonts } from './theme';

type TeamCrestProps = {
  uri?: string | null;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** Stagger delay for entrance. */
  delay?: number;
};

/** Crest with scale-in entrance + initials fallback. */
export function TeamCrest({ uri, name, size = 36, style, delay = 0 }: TeamCrestProps) {
  const [failed, setFailed] = useState(!uri);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.72)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durations.enter,
        delay,
        useNativeDriver,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay,
        useNativeDriver,
      }),
    ]).start();
  }, [delay, opacity, scale]);

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <Animated.View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size * 0.22, opacity, transform: [{ scale }] },
        style,
      ]}>
      {!failed && uri ? (
        <Image
          source={{ uri }}
          style={{ width: size * 0.78, height: size * 0.78 }}
          resizeMode="contain"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.28 }]}>{initials}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
  initials: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    letterSpacing: 0.4,
  },
});
