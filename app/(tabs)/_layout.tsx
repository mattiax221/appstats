import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colors, fonts } from '@/src/ui/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.night,
          borderTopColor: colors.hairline,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 58,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="previsioni"
        options={{
          title: 'Previsioni',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="preferiti"
        options={{
          title: 'Preferiti',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="impostazioni"
        options={{
          title: 'Impostazioni',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
