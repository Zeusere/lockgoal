import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, CircularProgress} from '../../components';
import {GOAL_TYPES} from '../../components/GoalCard';
import {useGoalStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';

export const CaptureScreen: React.FC = () => {
  const {goalType, dailyTarget, todayProgress, isGoalMet, incrementProgress} =
    useGoalStore();
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedGoal = GOAL_TYPES.find(g => g.type === goalType);
  const unit = selectedGoal?.unit || 'pages';

  const handleQuickAdd = (amount: number) => {
    incrementProgress(amount);
    triggerSuccess();
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount, 10);
    if (amount > 0) {
      incrementProgress(amount);
      setCustomAmount('');
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const getQuickAmounts = () => {
    switch (goalType) {
      case 'reading':
        return [1, 5, 10, 20];
      case 'studying':
        return [5, 10, 15, 30];
      case 'training':
        return [5, 10, 15, 30];
      case 'watching':
        return [10, 15, 30, 45];
      default:
        return [1, 5, 10, 20];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.header}>
          <Text style={styles.title}>Log Progress</Text>
          <Text style={styles.subtitle}>
            Track your {selectedGoal?.title.toLowerCase()} progress
          </Text>
        </Animated.View>

        <View style={styles.content}>
          {/* Mini progress */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.progressCard}>
            <CircularProgress
              current={todayProgress}
              total={dailyTarget}
              size={120}
              strokeWidth={8}
            />
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {todayProgress} / {dailyTarget}
              </Text>
              <Text style={styles.progressUnit}>{unit} completed</Text>
              {isGoalMet && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Goal Met!</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Quick add buttons */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            style={styles.quickAddSection}>
            <Text style={styles.sectionLabel}>Quick Add</Text>
            <View style={styles.quickAddGrid}>
              {getQuickAmounts().map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(amount)}
                  activeOpacity={0.7}>
                  <Text style={styles.quickAddAmount}>+{amount}</Text>
                  <Text style={styles.quickAddUnit}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Custom amount */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(600)}
            style={styles.customSection}>
            <Text style={styles.sectionLabel}>Custom Amount</Text>
            <View style={styles.customInputRow}>
              <View style={styles.customInputWrapper}>
                <TextInput
                  style={styles.customInput}
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="number-pad"
                  placeholder={`Enter ${unit}`}
                  placeholderTextColor={colors.textTertiary}
                  maxLength={4}
                />
                <Text style={styles.customUnit}>{unit}</Text>
              </View>
              <Button
                title="Add"
                onPress={handleCustomAdd}
                size="md"
                fullWidth={false}
                disabled={!customAmount || parseInt(customAmount, 10) <= 0}
                style={styles.addButton}
              />
            </View>
          </Animated.View>

          {/* Camera placeholder */}
          {goalType === 'reading' && (
            <Animated.View
              entering={FadeInDown.duration(500).delay(800)}
              style={styles.cameraSection}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() =>
                  Alert.alert(
                    'Coming Soon',
                    'Camera capture for book pages will be available in a future update.',
                  )
                }
                activeOpacity={0.7}>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.cameraTitle}>Capture Page</Text>
                <Text style={styles.cameraSubtitle}>
                  Take a photo of your book page
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Success overlay */}
        {showSuccess && (
          <Animated.View
            entering={BounceIn.duration(400)}
            style={styles.successOverlay}>
            <Text style={styles.successEmoji}>
              {isGoalMet ? '🎉' : '✅'}
            </Text>
            <Text style={styles.successText}>
              {isGoalMet ? 'Goal Complete!' : 'Progress Added!'}
            </Text>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  // Progress card
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    gap: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  progressUnit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completedBadge: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  completedText: {
    ...typography.labelSmall,
    color: colors.primary,
  },

  // Quick add
  quickAddSection: {
    marginTop: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickAddGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAddButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  quickAddAmount: {
    ...typography.h4,
    color: colors.primary,
  },
  quickAddUnit: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Custom input
  customSection: {
    marginTop: spacing.xxl,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  customInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  customInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  customUnit: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  addButton: {
    minWidth: 80,
  },

  // Camera
  cameraSection: {
    marginTop: spacing.xxl,
  },
  cameraButton: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 36,
  },
  cameraTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cameraSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Success overlay
  successOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  successEmoji: {
    fontSize: 48,
  },
  successText: {
    ...typography.label,
    color: colors.primary,
    marginTop: spacing.sm,
  },
});
