import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { resolveTeamCrest } from '@/src/data/history/crests';

import { colors, fonts } from './theme';

type TeamCrestProps = {
  uri?: string | null;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

/** Crest with spring entrance + initials only as last-resort fallback. */
export function TeamCrest({ uri, name, size = 36, style, delay = 0 }: TeamCrestProps) {
  const resolved = resolveTeamCrest(name, uri);
  const [failed, setFailed] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.78);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 160 }));
  }, [delay, opacity, scale]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const showImage = Boolean(resolved) && !failed;

  return (
    <Animated.View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size * 0.22 },
        anim,
        style,
      ]}>
      {showImage ? (
        <Image
          source={{ uri: resolved! }}
          style={{ width: size * 0.78, height: size * 0.78 }}
          resizeMode="contain"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size }]}>
          <Text style={[styles.initials, { fontSize: size * 0.3 }]}>{initials}</Text>
        </View>
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
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    letterSpacing: 0.4,
  },
});
