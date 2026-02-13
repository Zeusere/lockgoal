import {Platform, TextStyle} from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Headings
  h1: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,

  h4: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  // Body
  bodyLarge: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // Labels
  label: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  labelSmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.3,
  } as TextStyle,

  // Special
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,

  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  bigNumber: {
    fontFamily,
    fontSize: 48,
    fontWeight: '300',
    lineHeight: 56,
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
