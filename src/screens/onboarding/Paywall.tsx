import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Button} from '../../components';
import {colors, typography, spacing, borderRadius} from '../../theme';
import {purchasePlan, PlanId} from '../../services/revenueCatService';
import {useSubscriptionStore, useOnboardingStore} from '../../store';
import {useTranslation} from '../../i18n/useTranslation';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Paywall'>;

export const Paywall: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const setSubscription = useSubscriptionStore(state => state.setSubscription);
  const nextStep = useOnboardingStore(state => state.nextStep);
  const {t} = useTranslation();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const result = await purchasePlan(selectedPlan);
      if (result.active) {
        setSubscription(selectedPlan);
        nextStep();
        navigation.navigate('Ready');
      }
    } catch {
      Alert.alert(t('paywall_alert_title'), t('paywall_alert_message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('paywall_title')}</Text>
        <Text style={styles.subtitle}>{t('paywall_subtitle')}</Text>

        <TouchableOpacity style={[styles.plan, selectedPlan === 'monthly' && styles.planSelected]} onPress={() => setSelectedPlan('monthly')}>
          <Text style={styles.planTitle}>{t('paywall_monthly')}</Text>
          <Text style={styles.planPrice}>{t('paywall_per_month')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.plan, selectedPlan === 'yearly' && styles.planSelected]} onPress={() => setSelectedPlan('yearly')}>
          <Text style={styles.planTitle}>{t('paywall_yearly')}</Text>
          <Text style={styles.planPrice}>{t('paywall_per_year')}</Text>
          <Text style={styles.badge}>{t('paywall_badge')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Button title={t('paywall_cta')} onPress={handleSubscribe} loading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, padding: spacing.xl, justifyContent: 'center'},
  title: {...typography.h1, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.xxl},
  plan: {padding: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border, marginBottom: spacing.md},
  planSelected: {borderColor: colors.primary, backgroundColor: colors.primary + '0D'},
  planTitle: {...typography.h4, color: colors.textPrimary},
  planPrice: {...typography.body, color: colors.textSecondary, marginTop: 4},
  badge: {...typography.caption, color: colors.primary, marginTop: spacing.xs},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
