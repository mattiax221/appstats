import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { resolveLeagueBadge } from '@/src/data/history/crests';

import { PressableScale } from './PressableScale';
import { colors, fonts, spacing } from './theme';

type FilterChipProps = {
  label: string;
  selected?: boolean;
  crestUrl?: string;
  onPress?: () => void;
};

export function FilterChip({ label, selected, crestUrl, onPress }: FilterChipProps) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: selected ? 1 : 0,
      friction: 7,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [progress, selected]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.charcoal, 'rgba(212, 255, 42, 0.18)'],
  });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.hairline, colors.limeLine],
  });

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      accessibilityState={{ selected }}>
      <Animated.View style={[styles.chip, { backgroundColor, borderColor }]}>
        {crestUrl ? (
          <Image source={{ uri: crestUrl }} style={styles.crest} resizeMode="contain" />
        ) : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Animated.View>
    </PressableScale>
  );
}

type TimeChipProps = {
  label: string;
};

export function TimeChip({ label }: TimeChipProps) {
  return (
    <View style={styles.timeChip}>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );
}

type CompetitionBadgeProps = {
  name: string;
  crestUrl?: string;
  matchday?: number;
};

export function CompetitionBadge({ name, crestUrl, matchday }: CompetitionBadgeProps) {
  const badge = crestUrl || resolveLeagueBadge(name);
  return (
    <View style={styles.compBadge}>
      {badge ? (
        <Image source={{ uri: badge }} style={styles.compCrest} resizeMode="contain" />
      ) : null}
      <Text style={styles.compName} numberOfLines={1}>
        {name}
        {matchday != null ? ` · G${matchday}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
  },
  crest: { width: 16, height: 16 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.textSoft,
  },
  labelSelected: { color: colors.lime },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.charcoal,
  },
  timeLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.textSoft,
    letterSpacing: 0.3,
  },
  compBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '70%',
  },
  compCrest: { width: 14, height: 14 },
  compName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.3,
    color: colors.textMuted,
    flexShrink: 1,
  },
});
