import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from './theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.lime,
  },
});
