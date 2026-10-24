import { StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from './PressableScale';
import { colors, fonts, spacing } from './theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const ghost = variant === 'ghost';
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.base, ghost ? styles.ghost : styles.primary, style]}>
      <Text style={[styles.label, ghost ? styles.labelGhost : styles.labelPrimary]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.lime,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.limeLine,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  labelPrimary: { color: colors.night },
  labelGhost: { color: colors.text },
});
