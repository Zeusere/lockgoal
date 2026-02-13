import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, AVAILABLE_APPS} from '../../components';
import {useGoalStore, useAppStore, useOnboardingStore} from '../../store';
import {GOAL_TYPES} from '../../components/GoalCard';
import {colors, typography, spacing, borderRadius} from '../../theme';

export const Ready: React.FC = () => {
  const {goalType, dailyTarget} = useGoalStore();
  const {blockedAppIds} = useAppStore();
  const completeOnboarding = useOnboardingStore(
    state => state.completeOnboarding,
  );

  const selectedGoal = GOAL_TYPES.find(g => g.type === goalType);
  const selectedApps = AVAILABLE_APPS.filter(app =>
    blockedAppIds.includes(app.id),
  );

  const handleStart = () => {
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress bar complete */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.header}>
          <View style={styles.progressBar}>
            <Animated.View
              entering={FadeInUp.duration(800).delay(300)}
              style={[styles.progressFill, {width: '100%'}]}
            />
          </View>
        </Animated.View>

        {/* Success animation */}
        <Animated.View
          entering={BounceIn.duration(800).delay(400)}
          style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>🚀</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(700)}
          style={styles.textContainer}>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Your productivity journey starts now. Here's your setup:
          </Text>
        </Animated.View>

        {/* Summary card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(900)}
          style={styles.summaryCard}>
          {/* Goal summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>
                {selectedGoal?.icon || '📖'}
              </Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Daily Goal</Text>
              <Text style={styles.summaryValue}>
                {selectedGoal?.title} {dailyTarget} {selectedGoal?.unit}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Blocked apps summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>🔒</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Locked Apps</Text>
              <View style={styles.appBadges}>
                {selectedApps.map((app, index) => (
                  <Animated.View
                    key={app.id}
                    entering={ZoomIn.duration(300).delay(1100 + index * 100)}
                    style={styles.appBadge}>
                    <Text style={styles.appBadgeIcon}>{app.icon}</Text>
                    <Text style={styles.appBadgeName}>{app.name}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Motivation */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(1300)}
          style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            "The secret of getting ahead is getting started."
          </Text>
          <Text style={styles.motivationAuthor}>- Mark Twain</Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(1500)}
        style={styles.footer}>
        <Button
          title="Start My Journey"
          onPress={handleStart}
          icon={<Text style={{fontSize: 18}}>🚀</Text>}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },

  // Header
  header: {
    paddingTop: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // Success
  successContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '30',
  },
  successIcon: {
    fontSize: 44,
  },

  // Text
  textContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Summary
  summaryCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 20,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  appBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
  },
  appBadgeIcon: {
    fontSize: 14,
  },
  appBadgeName: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // Motivation
  motivationCard: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.primary + '08',
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  motivationText: {
    ...typography.body,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  motivationAuthor: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
