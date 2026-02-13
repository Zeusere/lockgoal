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

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Paywall'>;

export const Paywall: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const setSubscription = useSubscriptionStore(state => state.setSubscription);
  const nextStep = useOnboardingStore(state => state.nextStep);

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
      Alert.alert('Pago no completado', 'No se pudo iniciar RevenueCat. Revisa la configuración.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Desbloquea tu{`\n`}modo productividad</Text>
        <Text style={styles.subtitle}>Suscripción gestionada con RevenueCat. Empiezas hoy con foco total.</Text>

        <TouchableOpacity style={[styles.plan, selectedPlan === 'monthly' && styles.planSelected]} onPress={() => setSelectedPlan('monthly')}>
          <Text style={styles.planTitle}>Mensual</Text>
          <Text style={styles.planPrice}>€7.99 / mes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.plan, selectedPlan === 'yearly' && styles.planSelected]} onPress={() => setSelectedPlan('yearly')}>
          <Text style={styles.planTitle}>Anual</Text>
          <Text style={styles.planPrice}>€59.99 / año</Text>
          <Text style={styles.badge}>Mejor valor</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Button title="Pagar y continuar" onPress={handleSubscribe} loading={isLoading} />
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
