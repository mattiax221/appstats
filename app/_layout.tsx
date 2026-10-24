import {
  BebasNeue_400Regular,
  useFonts as useBebas,
} from '@expo-google-fonts/bebas-neue';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts as useOutfit,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { QueryProvider } from '@/src/providers/QueryProvider';
import { WebPhoneFrame } from '@/src/ui/WebPhoneFrame';
import { colors, fonts } from '@/src/ui/theme';

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
  const [outfitLoaded, outfitError] = useOutfit({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const loaded = bebasLoaded && outfitLoaded;
  const error = bebasError ?? outfitError;

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
      <WebPhoneFrame>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.night },
            headerTintColor: colors.text,
            headerTitleStyle: { fontFamily: fonts.bodyMedium },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.night },
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
          <Stack.Screen
            name="roadmap"
            options={{ title: 'Roadmap', headerBackTitle: 'Indietro' }}
          />
        </Stack>
      </WebPhoneFrame>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bootBrand: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 2,
  },
  bootHint: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
});
