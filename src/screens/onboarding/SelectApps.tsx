import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button, AppCard, AVAILABLE_APPS} from '../../components';
import {useAppStore, useOnboardingStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'SelectApps'
>;

export const SelectApps: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {blockedAppIds, toggleApp} = useAppStore();
  const nextStep = useOnboardingStore(state => state.nextStep);

  const handleContinue = () => {
    nextStep();
    navigation.navigate('Permissions');
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={[styles.progressFill, {width: '50%'}]} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 4</Text>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(500).delay(200)}>
          <Text style={styles.title}>Which apps{'\n'}distract you?</Text>
          <Text style={styles.subtitle}>
            Select the apps you want to lock until you complete your daily goal.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {blockedAppIds.length} app{blockedAppIds.length !== 1 ? 's' : ''}{' '}
            selected
          </Text>
        </Animated.View>

        <ScrollView
          style={styles.appList}
          contentContainerStyle={styles.appListContent}
          showsVerticalScrollIndicator={false}>
          {AVAILABLE_APPS.map((app, index) => (
            <Animated.View
              key={app.id}
              entering={FadeInDown.duration(400).delay(500 + index * 80)}>
              <AppCard
                app={app}
                selected={blockedAppIds.includes(app.id)}
                onToggle={toggleApp}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(800)}
        style={styles.footer}>
        <Button
          title={`Lock ${blockedAppIds.length} App${blockedAppIds.length !== 1 ? 's' : ''}`}
          onPress={handleContinue}
          disabled={blockedAppIds.length === 0}
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
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  selectedCount: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary + '12',
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  selectedCountText: {
    ...typography.labelSmall,
    color: colors.primary,
  },

  // App list
  appList: {
    flex: 1,
    marginTop: spacing.lg,
  },
  appListContent: {
    paddingBottom: spacing.lg,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
