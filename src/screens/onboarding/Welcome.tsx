import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
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
import {colors, typography, spacing} from '../../theme';

const {width} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Welcome'
>;

export const Welcome: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero illustration area */}
        <Animated.View
          entering={SlideInUp.duration(800).delay(200)}
          style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroEmoji}>🎯</Text>
          </View>
          <View style={styles.floatingBadge1}>
            <Text style={styles.floatingEmoji}>📖</Text>
          </View>
          <View style={styles.floatingBadge2}>
            <Text style={styles.floatingEmoji}>🔒</Text>
          </View>
          <View style={styles.floatingBadge3}>
            <Text style={styles.floatingEmoji}>🏆</Text>
          </View>
        </Animated.View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(500)}
            style={styles.title}>
            Take control{'\n'}of your time
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(700)}
            style={styles.subtitle}>
            Set daily goals, block distracting apps, and build habits that
            transform your productivity.
          </Animated.Text>
        </View>

        {/* Features */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(900)}
          style={styles.features}>
          <FeatureItem icon="📖" text="Set meaningful daily goals" />
          <FeatureItem icon="🔒" text="Block apps until you complete them" />
          <FeatureItem icon="🔥" text="Build streaks & earn rewards" />
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(1100)}
        style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('SetGoal')}
          variant="primary"
          size="lg"
        />
        <Text style={styles.termsText}>
          By continuing you agree to our Terms of Service
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const FeatureItem: React.FC<{icon: string; text: string}> = ({icon, text}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Text style={styles.featureIconText}>{icon}</Text>
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginTop: spacing.xxl,
    position: 'relative',
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '30',
  },
  heroEmoji: {
    fontSize: 52,
  },
  floatingBadge1: {
    position: 'absolute',
    top: 10,
    right: width * 0.15,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingBadge2: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingBadge3: {
    position: 'absolute',
    top: 30,
    left: width * 0.18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingEmoji: {
    fontSize: 20,
  },

  // Text
  textContainer: {
    marginTop: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },

  // Features
  features: {
    marginTop: spacing.xxxl,
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: {
    fontSize: 18,
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  termsText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
