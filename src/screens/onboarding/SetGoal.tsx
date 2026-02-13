import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button, GOAL_TYPES, GoalType} from '../../components';
import {useGoalStore} from '../../store';
import {useOnboardingStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'SetGoal'
>;

export const SetGoal: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {goalType, dailyTarget, setGoalType, setDailyTarget} = useGoalStore();
  const nextStep = useOnboardingStore(state => state.nextStep);

  const [selectedType, setSelectedType] = useState<GoalType>(goalType);
  const [target, setTarget] = useState(String(dailyTarget));

  const selectedGoal = GOAL_TYPES.find(g => g.type === selectedType);

  const handleContinue = () => {
    setGoalType(selectedType);
    setDailyTarget(parseInt(target, 10) || 20);
    nextStep();
    navigation.navigate('SelectApps');
  };

  const handleTypeSelect = (type: GoalType) => {
    setSelectedType(type);
    // Set sensible defaults based on type
    if (type === 'reading') {
      setTarget('20');
    } else if (type === 'studying' || type === 'training') {
      setTarget('30');
    } else if (type === 'watching') {
      setTarget('45');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: '25%'}]} />
          </View>
          <Text style={styles.stepLabel}>Step 1 of 4</Text>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.duration(500).delay(200)}>
            <Text style={styles.title}>What's your{'\n'}daily goal?</Text>
            <Text style={styles.subtitle}>
              Choose what you want to accomplish before using your apps.
            </Text>
          </Animated.View>

          {/* Goal type selector */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            style={styles.goalTypes}>
            {GOAL_TYPES.map(goal => (
              <TouchableOpacity
                key={goal.type}
                style={[
                  styles.goalTypeCard,
                  selectedType === goal.type && styles.goalTypeCardSelected,
                ]}
                onPress={() => handleTypeSelect(goal.type)}
                activeOpacity={0.7}>
                <Text style={styles.goalTypeIcon}>{goal.icon}</Text>
                <Text
                  style={[
                    styles.goalTypeTitle,
                    selectedType === goal.type &&
                      styles.goalTypeTitleSelected,
                  ]}>
                  {goal.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Target input */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(600)}
            style={styles.targetContainer}>
            <Text style={styles.targetLabel}>Daily target</Text>
            <View style={styles.targetInputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>{selectedGoal?.icon}</Text>
                <TextInput
                  style={styles.targetInput}
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="number-pad"
                  maxLength={4}
                  selectTextOnFocus
                />
              </View>
              <Text style={styles.unitLabel}>{selectedGoal?.unit}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(700)}
          style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!target || parseInt(target, 10) <= 0}
          />
        </Animated.View>
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
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: colors.textPrimary,
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
  stepLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // Goal types
  goalTypes: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  goalTypeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    gap: spacing.xs,
  },
  goalTypeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  goalTypeIcon: {
    fontSize: 28,
  },
  goalTypeTitle: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  goalTypeTitleSelected: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Target
  targetContainer: {
    marginTop: spacing.xxl,
  },
  targetLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  targetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 56,
    gap: spacing.sm,
  },
  inputIcon: {
    fontSize: 20,
  },
  targetInput: {
    flex: 1,
    ...typography.h4,
    color: colors.textPrimary,
    padding: 0,
  },
  unitLabel: {
    ...typography.body,
    color: colors.textSecondary,
    minWidth: 60,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
