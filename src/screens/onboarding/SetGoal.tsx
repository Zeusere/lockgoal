import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {FadeInUp, FadeInDown} from 'react-native-reanimated';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing, borderRadius, GOAL_TYPES} from '../../theme';
import {useOnboardingStore} from '../../store';
import {useTranslation} from '../../i18n/useTranslation';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SetGoal'>;

export const SetGoal: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const nextStep = useOnboardingStore(state => state.nextStep);
  const {t} = useTranslation();

  const handleContinue = () => {
    nextStep();
    navigation.navigate('SelectApps');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.title}>{t('setgoal_title')}</Text>
          <Text style={styles.subtitle}>{t('setgoal_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.cards}>
          {GOAL_TYPES.map(gt => (
            <View key={gt.id} style={styles.card}>
              <Text style={styles.cardIcon}>{gt.icon}</Text>
              <Text style={styles.cardLabel}>{t(`goalType_${gt.id}`)}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.footer}>
        <Button title={t('setgoal_continue')} onPress={handleContinue} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  scroll: {paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl},
  title: {...typography.h2, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  cards: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xxl},
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
    minHeight: 100,
    justifyContent: 'center',
  },
  cardIcon: {fontSize: 36},
  cardLabel: {...typography.label, color: colors.textSecondary, marginTop: spacing.xs},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
