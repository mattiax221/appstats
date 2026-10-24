/**
 * AppStats — matchday / floodlights / pitch.
 * Deep field green + charcoal night + sharp lime. No purple, cream, or SaaS gray.
 */
export const colors = {
  night: '#050A08',
  nightLift: '#0A1410',
  charcoal: '#101C16',
  pitchDeep: '#0C2E1C',
  pitch: '#154A2C',
  pitchLit: '#1F6B3E',
  lime: '#D4FF2A',
  limeDim: 'rgba(212, 255, 42, 0.16)',
  limeLine: 'rgba(212, 255, 42, 0.28)',
  text: '#F4F7F1',
  textSoft: '#C5D1C8',
  textMuted: '#7E9186',
  hairline: 'rgba(244, 247, 241, 0.1)',
  live: '#D4FF2A',
  danger: '#FF5C4D',
  tabInactive: '#6A7D72',
  /** Stack / boot chrome */
  bg: '#050A08',
} as const;

export const fonts = {
  brand: 'BebasNeue_400Regular',
  body: 'Outfit_400Regular',
  bodyMedium: 'Outfit_500Medium',
  bodySemi: 'Outfit_600SemiBold',
  bodyBold: 'Outfit_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  hero: 56,
} as const;

export const radii = {
  none: 0,
  sm: 2,
  md: 4,
} as const;
