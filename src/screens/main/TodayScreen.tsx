import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  CircularProgress,
  Button,
  StreakBadge,
  AppCard,
  AVAILABLE_APPS,
} from '../../components';
import {GOAL_TYPES} from '../../components/GoalCard';
import {useGoalStore, useAppStore} from '../../store';
import {useScreenTime} from '../../hooks/useScreenTime';
import {MainTabParamList} from '../../navigation/types';
import {colors, typography, spacing, borderRadius} from '../../theme';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Today'>;

export const TodayScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {goalType, dailyTarget, todayProgress, streak, isGoalMet} =
    useGoalStore();
  const {blockedAppIds} = useAppStore();
  const {syncBlockStatus} = useScreenTime();

  const selectedGoal = GOAL_TYPES.find(g => g.type === goalType);
  const blockedApps = AVAILABLE_APPS.filter(app =>
    blockedAppIds.includes(app.id),
  );
  const remaining = Math.max(dailyTarget - todayProgress, 0);

  // Sync block status whenever goal completion changes
  useEffect(() => {
    syncBlockStatus();
  }, [isGoalMet, syncBlockStatus]);

  const getGoalTitle = () => {
    switch (goalType) {
      case 'reading':
        return "Today's Reading";
      case 'studying':
        return "Today's Study Session";
      case 'training':
        return "Today's Training";
      case 'watching':
        return "Today's Viewing";
      default:
        return "Today's Goal";
    }
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
          <View>
            <Text style={styles.title}>{getGoalTitle()}</Text>
            <StreakBadge days={streak} />
          </View>
        </Animated.View>

        {/* Progress circle */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.progressContainer}>
          <CircularProgress
            current={todayProgress}
            total={dailyTarget}
            size={200}
            strokeWidth={12}
            label={`of ${dailyTarget} ${selectedGoal?.unit || 'pages'}`}
          />
        </Animated.View>

        {/* Lock status */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.lockStatusContainer}>
          {isGoalMet ? (
            <View style={styles.unlockedBanner}>
              <Text style={styles.unlockedIcon}>🎉</Text>
              <View>
                <Text style={styles.unlockedTitle}>Goal Complete!</Text>
                <Text style={styles.unlockedSubtitle}>
                  All your apps are unlocked
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.lockedBanner}>
              <Text style={styles.lockedIcon}>🔒</Text>
              <Text style={styles.lockedText}>
                {remaining} {selectedGoal?.unit || 'pages'} to unlock
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Capture button */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(500)}
          style={styles.captureButtonContainer}>
          <Button
            title={
              goalType === 'reading' ? 'Capture Page' : 'Log Progress'
            }
            onPress={() => navigation.navigate('Capture')}
            icon={
              <Text style={{fontSize: 18}}>
                {goalType === 'reading' ? '📷' : '✏️'}
              </Text>
            }
          />
        </Animated.View>

        {/* Blocked apps */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(600)}
          style={styles.appsSection}>
          <Text style={styles.sectionTitle}>Your Apps</Text>
          <Text style={styles.sectionSubtitle}>
            {isGoalMet
              ? 'All apps unlocked - great job!'
              : 'Complete your goal to unlock'}
          </Text>
          <View style={styles.appsGrid}>
            {blockedApps.map((app, index) => (
              <Animated.View
                key={app.id}
                entering={FadeInDown.duration(300).delay(700 + index * 80)}>
                <AppCard app={app} locked={!isGoalMet} compact />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
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
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  // Progress
  progressContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },

  // Lock status
  lockStatusContainer: {
    paddingHorizontal: spacing.xl,
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.secondary + '30',
    borderRadius: borderRadius.lg,
  },
  lockedIcon: {
    fontSize: 16,
  },
  lockedText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary + '12',
    borderRadius: borderRadius.lg,
  },
  unlockedIcon: {
    fontSize: 28,
  },
  unlockedTitle: {
    ...typography.label,
    color: colors.primary,
  },
  unlockedSubtitle: {
    ...typography.bodySmall,
    color: colors.primaryLight,
    marginTop: 2,
  },

  // Capture button
  captureButtonContainer: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },

  // Apps section
  appsSection: {
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
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
});
