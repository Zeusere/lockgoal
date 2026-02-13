import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, AVAILABLE_APPS} from '../../components';
import {useGoalStore, useAppStore, useOnboardingStore} from '../../store';
import {colors, typography, spacing, borderRadius} from '../../theme';

export const Ready: React.FC = () => {
  const {dailyGoals} = useGoalStore();
  const {blockedAppIds} = useAppStore();
  const completeOnboarding = useOnboardingStore(state => state.completeOnboarding);

  const selectedApps = AVAILABLE_APPS.filter(app => blockedAppIds.includes(app.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.Text entering={FadeInUp.duration(500)} style={styles.title}>
          Tu sistema está listo
        </Animated.Text>
        <Text style={styles.subtitle}>Ya pagaste el acceso. El registro se hará dentro para vincular tu progreso y gamificación.</Text>

        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.card}>
          <Text style={styles.cardTitle}>Objetivos de hoy</Text>
          {dailyGoals.map(goal => (
            <Text key={goal.id} style={styles.rowText}>• {goal.title} ({goal.target})</Text>
          ))}

          <Text style={[styles.cardTitle, {marginTop: spacing.lg}]}>Apps bloqueadas</Text>
          <View style={styles.apps}>
            {selectedApps.map(app => (
              <View key={app.id} style={styles.appBadge}>
                <Image source={{uri: app.iconUrl}} style={styles.appIcon} />
                <Text style={styles.appName}>{app.name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Button title="Entrar a LockGoal" onPress={completeOnboarding} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, padding: spacing.xl},
  title: {...typography.h2, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  card: {marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg},
  cardTitle: {...typography.label, color: colors.textPrimary},
  rowText: {...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs},
  apps: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm},
  appBadge: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: spacing.sm, borderRadius: borderRadius.sm, backgroundColor: colors.surfaceAlt},
  appIcon: {width: 14, height: 14},
  appName: {...typography.caption, color: colors.textSecondary},
  footer: {paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
});
