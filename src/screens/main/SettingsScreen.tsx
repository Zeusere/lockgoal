import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppCard, AVAILABLE_APPS, GOAL_TYPES} from '../../components';
import {GoalType} from '../../components/GoalCard';
import {useGoalStore, useAppStore, useOnboardingStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';

export const SettingsScreen: React.FC = () => {
  const {goalType, dailyTarget, setGoalType, setDailyTarget} = useGoalStore();
  const {blockedAppIds, toggleApp} = useAppStore();
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);

  const [targetInput, setTargetInput] = useState(String(dailyTarget));
  const selectedGoal = GOAL_TYPES.find(g => g.type === goalType);

  const handleTargetChange = (value: string) => {
    setTargetInput(value);
    const numValue = parseInt(value, 10);
    if (numValue > 0) {
      setDailyTarget(numValue);
    }
  };

  const handleGoalTypeChange = (type: GoalType) => {
    setGoalType(type);
    // Set default targets
    switch (type) {
      case 'reading':
        setTargetInput('20');
        setDailyTarget(20);
        break;
      case 'studying':
      case 'training':
        setTargetInput('30');
        setDailyTarget(30);
        break;
      case 'watching':
        setTargetInput('45');
        setDailyTarget(45);
        break;
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Setup',
      'This will take you back through the onboarding process. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetOnboarding,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </Animated.View>

        {/* Goal Type */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Type</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your daily challenge
          </Text>
          <View style={styles.goalTypeRow}>
            {GOAL_TYPES.map(goal => (
              <TouchableOpacity
                key={goal.type}
                style={[
                  styles.goalTypeChip,
                  goalType === goal.type && styles.goalTypeChipSelected,
                ]}
                onPress={() => handleGoalTypeChange(goal.type)}
                activeOpacity={0.7}>
                <Text style={styles.goalTypeEmoji}>{goal.icon}</Text>
                <Text
                  style={[
                    styles.goalTypeLabel,
                    goalType === goal.type && styles.goalTypeLabelSelected,
                  ]}>
                  {goal.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Daily Goal */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Daily {selectedGoal?.title} Goal</Text>
          <View style={styles.goalInputRow}>
            <View style={styles.goalInputWrapper}>
              <Text style={styles.goalInputIcon}>
                {selectedGoal?.icon || '📖'}
              </Text>
              <TextInput
                style={styles.goalInput}
                value={targetInput}
                onChangeText={handleTargetChange}
                keyboardType="number-pad"
                maxLength={4}
                selectTextOnFocus
              />
            </View>
            <Text style={styles.goalUnit}>{selectedGoal?.unit}</Text>
          </View>
        </Animated.View>

        {/* Apps to Lock */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Apps to Lock</Text>
          <Text style={styles.sectionSubtitle}>
            Select which apps should be locked until you complete your daily goal
          </Text>
          <View style={styles.appList}>
            {AVAILABLE_APPS.map(app => (
              <AppCard
                key={app.id}
                app={app}
                selected={blockedAppIds.includes(app.id)}
                onToggle={toggleApp}
              />
            ))}
          </View>
        </Animated.View>

        {/* Danger zone */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(500)}
          style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Advanced
          </Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetOnboarding}
            activeOpacity={0.7}>
            <Text style={styles.dangerButtonIcon}>🔄</Text>
            <View>
              <Text style={styles.dangerButtonTitle}>Redo Setup</Text>
              <Text style={styles.dangerButtonSubtitle}>
                Go through onboarding again
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>LockGoal v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Built with purpose. Stay focused.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },

  // Header
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  // Section
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Goal type
  goalTypeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  goalTypeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    gap: 4,
  },
  goalTypeChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  goalTypeEmoji: {
    fontSize: 22,
  },
  goalTypeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  goalTypeLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Goal input
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  goalInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 52,
    gap: spacing.sm,
  },
  goalInputIcon: {
    fontSize: 18,
  },
  goalInput: {
    flex: 1,
    ...typography.h4,
    color: colors.textPrimary,
    padding: 0,
  },
  goalUnit: {
    ...typography.body,
    color: colors.textSecondary,
    minWidth: 60,
  },

  // App list
  appList: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Danger zone
  dangerTitle: {
    color: colors.textSecondary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dangerButtonIcon: {
    fontSize: 24,
  },
  dangerButtonTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  dangerButtonSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // App info
  appInfo: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    gap: spacing.xs,
  },
  appInfoText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
