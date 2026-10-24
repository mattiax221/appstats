import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeIn } from './FadeIn';
import { colors, spacing } from './theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  /** Skip enter animation (rare). */
  animate?: boolean;
};

export function Screen({
  children,
  scroll = true,
  style,
  animate = true,
}: ScreenProps) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, style]}
      showsVerticalScrollIndicator={false}>
      {animate ? <FadeIn>{children}</FadeIn> : children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, style]}>
      {animate ? <FadeIn>{children}</FadeIn> : children}
    </View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.night, colors.nightLift, colors.pitchDeep]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,248,230,0.09)', 'transparent']}
        style={styles.flood}
        pointerEvents="none"
      />
      <View style={styles.midline} pointerEvents="none" />
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.column}>{inner}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night },
  flex: { flex: 1 },
  fill: { flex: 1 },
  /** Keeps content phone-width when parent is already framed; harmless on native. */
  column: { flex: 1, width: '100%', maxWidth: 430, alignSelf: 'center' },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  flood: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  midline: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: '42%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(244, 247, 241, 0.06)',
  },
});
