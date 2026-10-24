/**
 * AppStats visual language — night pitch, stadium amber.
 * Avoids generic purple dashboards and cream/terracotta tropes.
 */
export const colors = {
  bg: '#07140E',
  bgMid: '#0C1F15',
  bgElevated: '#122A1C',
  pitch: '#1B4D2F',
  pitchLine: '#C8F542',
  amber: '#E8B84A',
  amberSoft: 'rgba(232, 184, 74, 0.18)',
  text: '#F2F7F0',
  textMuted: '#8FA898',
  border: 'rgba(200, 245, 66, 0.12)',
  danger: '#E85A4A',
  tabInactive: '#6B8574',
} as const;

export const fonts = {
  brand: 'BebasNeue_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
