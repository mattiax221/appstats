import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from './theme';

type ScorePillProps = {
  home: number | null | undefined;
  away: number | null | undefined;
  live?: boolean;
};

export function ScorePill({ home, away, live }: ScorePillProps) {
  return (
    <View style={[styles.pill, live && styles.pillLive]}>
      <Text style={[styles.score, live && styles.scoreLive]}>
        {home ?? '–'}
      </Text>
      <Text style={[styles.sep, live && styles.scoreLive]}>:</Text>
      <Text style={[styles.score, live && styles.scoreLive]}>
        {away ?? '–'}
      </Text>
    </View>
  );
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
