export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  full: 9999,
} as const;

export const layout = {
  screenPaddingHorizontal: 24,
  screenPaddingTop: 16,
  cardPadding: 20,
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

export type SpacingKey = keyof typeof spacing;
