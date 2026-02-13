export const colors = {
  // Primary palette
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F0EB',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9B9B9B',
  textInverse: '#FFFFFF',

  // Accents
  primary: '#6B7F5E',
  primaryLight: '#8A9E7D',
  primaryDark: '#4F6145',
  secondary: '#D4C5B2',
  secondaryLight: '#E8DDD0',

  // Feedback
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // UI elements
  border: '#E5DDD3',
  borderLight: '#F0EAE2',
  divider: '#EDE7DF',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // App-specific
  lockIcon: '#D4C5B2',
  streakFire: '#FF6B35',
  progressTrack: '#E8E0D6',
  progressFill: '#6B7F5E',
  checkmark: '#6B7F5E',
} as const;

export type ColorKey = keyof typeof colors;
