import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography, spacing} from '../theme';

interface StreakBadgeProps {
  days: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({days}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.text}>
        {days} day{days !== 1 ? 's' : ''} streak
      </Text>
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
