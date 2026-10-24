import { type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors } from './theme';

const PHONE_WIDTH = 430;

type WebPhoneFrameProps = {
  children: ReactNode;
};

/**
 * On web/desktop, center a phone-width column so the UI doesn't stretch
 * across a wide Chrome window. Native: passthrough.
 */
export function WebPhoneFrame({ children }: WebPhoneFrameProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.glow} pointerEvents="none" />
      <View style={styles.column}>{children}</View>
    </View>
  );
}

export const webPhoneWidth = PHONE_WIDTH;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.night,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.pitchDeep,
    opacity: 0.35,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: PHONE_WIDTH,
    backgroundColor: colors.night,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
});
