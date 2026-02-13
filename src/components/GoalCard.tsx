import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography, borderRadius, spacing} from '../theme';

export type GoalType = 'reading' | 'studying' | 'training' | 'watching';

interface GoalInfo {
  type: GoalType;
  icon: string;
  title: string;
  description: string;
  unit: string;
}

export const GOAL_TYPES: GoalInfo[] = [
  {
    type: 'reading',
    icon: '📖',
    title: 'Read',
    description: 'Read pages from a book',
    unit: 'pages',
  },
  {
    type: 'studying',
    icon: '📚',
    title: 'Study',
    description: 'Study a subject or topic',
    unit: 'minutes',
  },
  {
    type: 'training',
    icon: '🎓',
    title: 'Training',
    description: 'Complete a training video',
    unit: 'minutes',
  },
  {
    type: 'watching',
    icon: '🎬',
    title: 'Watch',
    description: 'Finish a movie or episode',
    unit: 'minutes',
  },
];

interface GoalCardProps {
  goal: GoalInfo;
  selected?: boolean;
  onSelect?: (type: GoalType) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  selected = false,
  onSelect,
}) => {
  return (
    <View style={[styles.container, selected && styles.containerSelected]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{goal.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{goal.title}</Text>
        <Text style={styles.description}>{goal.description}</Text>
      </View>
      {selected && (
        <View style={styles.checkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </View>
  );
};

interface GoalCardSelectableProps {
  goal: GoalInfo;
  selected: boolean;
  onSelect: (type: GoalType) => void;
}

export const GoalCardSelectable: React.FC<GoalCardSelectableProps> = ({
  goal,
  selected,
  onSelect,
}) => {
  const handlePress = () => {
    onSelect(goal.type);
  };

  return (
    <View style={styles.touchableWrapper}>
      <View
        style={[styles.container, selected && styles.containerSelected]}
        onTouchEnd={handlePress}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{goal.icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.description}>{goal.description}</Text>
        </View>
        {selected && (
          <View style={styles.checkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    marginBottom: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.label,
    color: colors.textPrimary,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
