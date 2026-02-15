import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../theme';
import {useTranslation} from '../i18n/useTranslation';

interface StreakBadgeProps {
  days: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({days}) => {
  const {t} = useTranslation();
  const key = days === 1 ? 'streak_days' : 'streak_days_plural';
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.text}>{t(key, {count: days})}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
