import { Tabs } from 'expo-router';
import { Text, StyleSheet, type ColorValue } from 'react-native';

import { colors, fonts } from '@/src/ui/theme';

function TabIcon({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{label}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pitchLine,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon label="◉" color={color} />,
        }}
      />
      <Tabs.Screen
        name="previsioni"
        options={{
          title: 'Previsioni',
          tabBarIcon: ({ color }) => <TabIcon label="◈" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preferiti"
        options={{
          title: 'Preferiti',
          tabBarIcon: ({ color }) => <TabIcon label="★" color={color} />,
        }}
      />
      <Tabs.Screen
        name="impostazioni"
        options={{
          title: 'Impostazioni',
          tabBarIcon: ({ color }) => <TabIcon label="☰" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 16,
    lineHeight: 20,
  },
});
