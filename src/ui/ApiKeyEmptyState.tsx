import { Linking, StyleSheet, Text, View } from 'react-native';

import { FOOTBALL_DATA_REGISTER_URL } from '@/src/config/env';
import { PrimaryButton } from '@/src/ui/PrimaryButton';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function ApiKeyEmptyState() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Token mancante</Text>
      <Text style={styles.body}>
        Per vedere partite e classifiche serve il token gratuito di
        football-data.org.
      </Text>
      <PrimaryButton
        label="Registrati (gratis)"
        onPress={() => Linking.openURL(FOOTBALL_DATA_REGISTER_URL)}
        style={styles.btn}
      />
      <Text style={styles.hint}>
        Poi in `.env`: EXPO_PUBLIC_FOOTBALL_DATA_TOKEN=…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  btn: { alignSelf: 'flex-start' },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
