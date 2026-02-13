import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {useOnboardingStore} from '../../store';
import {useScreenTime} from '../../hooks/useScreenTime';
import {colors, typography, spacing, borderRadius} from '../../theme';

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Permissions'
>;

export const Permissions: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const nextStep = useOnboardingStore(state => state.nextStep);
  const {requestPermission, isLoading} = useScreenTime();
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setPermissionGranted(granted);
    if (granted) {
      setTimeout(() => {
        nextStep();
        navigation.navigate('Ready');
      }, 500);
    }
  };

  const handleSkip = () => {
    nextStep();
    navigation.navigate('Ready');
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
          <View style={[styles.progressFill, {width: '75%'}]} />
        </View>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
      </Animated.View>

      <View style={styles.content}>
        {/* Shield illustration */}
        <Animated.View
          entering={SlideInUp.duration(700).delay(300)}
          style={styles.illustrationContainer}>
          <View style={styles.shieldOuter}>
            <View style={styles.shieldInner}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
          </View>
          <View style={styles.decorDot1} />
          <View style={styles.decorDot2} />
          <View style={styles.decorDot3} />
        </Animated.View>

        {/* Text */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(500)}
          style={styles.textContainer}>
          <Text style={styles.title}>Enable Screen{'\n'}Time Access</Text>
          <Text style={styles.subtitle}>
            LockGoal needs Screen Time permission to block distracting apps
            until you complete your daily goals.
          </Text>
        </Animated.View>

        {/* Permission details */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(700)}
          style={styles.details}>
          <PermissionDetail
            icon="🔒"
            title="App Blocking"
            description="Temporarily restrict access to selected apps"
          />
          <PermissionDetail
            icon="👁️"
            title="Privacy First"
            description="We never read your data or track your usage"
          />
          <PermissionDetail
            icon="🔓"
            title="Always Reversible"
            description="You can revoke access anytime in iOS Settings"
          />
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(900)}
        style={styles.footer}>
        {permissionGranted ? (
          <View style={styles.successBanner}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>Permission granted!</Text>
          </View>
        ) : (
          <>
            <Button
              title="Allow Screen Time Access"
              onPress={handleRequestPermission}
              loading={isLoading}
              icon={<Text style={{fontSize: 18}}>🛡️</Text>}
            />
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const PermissionDetail: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({icon, title, description}) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Text style={styles.detailIconText}>{icon}</Text>
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailDescription}>{description}</Text>
    </View>
  </View>
);

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

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },

  // Illustration
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    marginTop: spacing.xxl,
    position: 'relative',
  },
  shieldOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    fontSize: 36,
  },
  decorDot1: {
    position: 'absolute',
    top: 20,
    right: '25%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary + '20',
  },
  decorDot2: {
    position: 'absolute',
    bottom: 25,
    left: '20%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  decorDot3: {
    position: 'absolute',
    top: 40,
    left: '28%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary + '15',
  },

  // Text
  textContainer: {
    marginTop: spacing.xl,
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
    marginTop: spacing.md,
    lineHeight: 22,
  },

  // Details
  details: {
    marginTop: spacing.xxl,
    gap: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  detailDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.lg,
  },
  successIcon: {
    fontSize: 20,
  },
  successText: {
    ...typography.label,
    color: colors.primary,
  },
});
