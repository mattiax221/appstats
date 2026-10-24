import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useNativeDriver } from './motion';
import { colors, fonts, spacing } from './theme';

type ScorePillProps = {
  home: number | null | undefined;
  away: number | null | undefined;
  live?: boolean;
};

export function ScorePill({ home, away, live }: ScorePillProps) {
  const glow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!live) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 0.55, duration: 800, useNativeDriver }),
        Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow, live]);

  const pill = (
    <View style={[styles.pill, live && styles.pillLive]}>
      <Text style={[styles.score, live && styles.scoreLive]}>{home ?? '–'}</Text>
      <Text style={[styles.sep, live && styles.scoreLive]}>:</Text>
      <Text style={[styles.score, live && styles.scoreLive]}>{away ?? '–'}</Text>
    </View>
  );

  if (!live) return pill;

  return <Animated.View style={{ opacity: glow }}>{pill}</Animated.View>;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.charcoal,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 56,
    justifyContent: 'center',
  },
  pillLive: {
    backgroundColor: colors.limeDim,
  },
  score: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  scoreLive: {
    color: colors.lime,
  },
  sep: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
  },
});
