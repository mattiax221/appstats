import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from './theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.lime,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
