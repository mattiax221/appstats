import {
  BebasNeue_400Regular,
  useFonts as useBebas,
} from '@expo-google-fonts/bebas-neue';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts as useDmSans,
} from '@expo-google-fonts/dm-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { QueryProvider } from '@/src/providers/QueryProvider';
import { colors } from '@/src/ui/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Splash is native-only; calling preventAutoHide on web leaves a blank frame.
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {
    /* ignore if already prevented */
  });
}

export default function RootLayout() {
  const [bebasLoaded, bebasError] = useBebas({ BebasNeue_400Regular });
  const [dmLoaded, dmError] = useDmSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const loaded = bebasLoaded && dmLoaded;
  const error = bebasError ?? dmError;

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [loaded]);

  // Avoid SSR/web `return null` (empty #root + dark body = black screen).
  if (!loaded) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootBrand}>AppStats</Text>
        <Text style={styles.bootHint}>Caricamento…</Text>
      </View>
    );
  }

  return (
    <QueryProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: 'DMSans_500Medium' },
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="match/[id]"
          options={{ title: 'Partita', headerBackTitle: 'Indietro' }}
        />
        <Stack.Screen
          name="team/[id]"
          options={{ title: 'Squadra', headerBackTitle: 'Indietro' }}
        />
      </Stack>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bootBrand: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bootHint: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
});
