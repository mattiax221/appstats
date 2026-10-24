import { radii, spacing } from './theme';

/** Shared layout grammar — every list card / row uses these. */
export const layout = {
  cardPad: spacing.md,
  cardGap: spacing.sm,
  cardRadius: radii.lg,
  sectionGap: spacing.lg,
  rowGap: spacing.sm,
  crestSm: 28,
  crestMd: 40,
  crestLg: 56,
  crestXl: 72,
} as const;
