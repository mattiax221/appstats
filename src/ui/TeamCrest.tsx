import { useState } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from './theme';

type TeamCrestProps = {
  uri?: string | null;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Crest image with initials fallback if CDN fails. */
export function TeamCrest({ uri, name, size = 36, style }: TeamCrestProps) {
  const [failed, setFailed] = useState(!uri);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size * 0.22 },
        style,
      ]}>
      {!failed && uri ? (
        <Image
          source={{ uri }}
          style={{ width: size * 0.78, height: size * 0.78 }}
          resizeMode="contain"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.28 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
  initials: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    letterSpacing: 0.4,
  },
});
