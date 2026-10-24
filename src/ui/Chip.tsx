import { Image, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from './PressableScale';
import { colors, fonts, spacing } from './theme';

type FilterChipProps = {
  label: string;
  selected?: boolean;
  crestUrl?: string;
  onPress?: () => void;
};

export function FilterChip({ label, selected, crestUrl, onPress }: FilterChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}>
      {crestUrl ? (
        <Image source={{ uri: crestUrl }} style={styles.crest} resizeMode="contain" />
      ) : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
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
  return (
    <View style={styles.compBadge}>
      {crestUrl ? (
        <Image source={{ uri: crestUrl }} style={styles.compCrest} resizeMode="contain" />
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
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.hairline,
    minHeight: 40,
  },
  chipSelected: {
    backgroundColor: colors.limeDim,
    borderColor: colors.limeLine,
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
