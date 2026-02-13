import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {colors, typography, borderRadius, spacing} from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const containerStyles = [
    styles.base,
    styles[`container_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    typography.button,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textInverse : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  container_primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
  },
  container_secondary: {
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.xxl,
  },
  container_outline: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.xxl,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  container_ghost: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  },

  // Text colors
  text_primary: {
    color: colors.textInverse,
  },
  text_secondary: {
    color: colors.textPrimary,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },

  // Text sizes
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 16,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
