import { Platform } from 'react-native';

/** Native driver is unreliable on web for RN Animated. */
export const useNativeDriver = Platform.OS !== 'web';

export const durations = {
  enter: 420,
  stagger: 70,
  bar: 900,
} as const;
