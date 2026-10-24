import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/src/ui/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Non trovata' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Schermata assente</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Torna alla Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.bg,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.pitchLine,
  },
});
