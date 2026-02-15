import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.42;
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInUp, FadeInDown, ZoomIn} from 'react-native-reanimated';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing} from '../../theme';
import {useTranslation} from '../../i18n/useTranslation';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const Welcome: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={ZoomIn.duration(600)} style={[styles.heroImageWrap, {height: HERO_HEIGHT}]}>
        <ImageBackground
          source={require('../../assets/clock_onboarding.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(500).delay(300)}>
          <Text style={styles.title}>{t('welcome_title')}</Text>
          <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📖</Text>
            <Text style={styles.featureText}>{t('welcome_feature_goals')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>{t('welcome_feature_apps')}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔥</Text>
            <Text style={styles.featureText}>{t('welcome_feature_streaks')}</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.footer}>
        <Button title={t('welcome_cta')} onPress={() => navigation.navigate('SetGoal')} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  heroImageWrap: {
    width: SCREEN_WIDTH,
    alignSelf: 'stretch',
    marginBottom: spacing.xxl,
  },
  heroImage: {flex: 1, width: '100%', height: '100%'},
  content: {flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center'},
  title: {...typography.h1, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  features: {flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.xxl},
  feature: {alignItems: 'center', gap: spacing.xs},
  featureIcon: {fontSize: 28},
  featureText: {...typography.caption, color: colors.textSecondary},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
