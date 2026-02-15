import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, AppCard, AVAILABLE_APPS, StreakBadge} from '../../components';
import {useAppStore, useFocusStore, useGoalStore} from '../../store';
import {colors, typography, spacing, borderRadius, getGoalType} from '../../theme';
import {useScreenTime} from '../../hooks/useScreenTime';
import {useTranslation} from '../../i18n/useTranslation';

export const TodayScreen: React.FC = () => {
  const {dailyGoals, isGoalMet} = useGoalStore();
  const {blockedAppIds} = useAppStore();
  const {isFocusModeActive, countdown, startCountdown, setCountdown, activateFocusMode} = useFocusStore();
  const {syncBlockStatus} = useScreenTime();
  const streak = useGoalStore(state => state.streak);
  const {t} = useTranslation();

  const blockedApps = AVAILABLE_APPS.filter(app => blockedAppIds.includes(app.id));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => setCountdown(countdown - 1), 1000);
    }
    if (countdown === 0) {
      activateFocusMode();
      syncBlockStatus();
      setCountdown(null);
      Alert.alert(t('today_alert_title'), t('today_alert_message'));
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown, setCountdown, activateFocusMode, syncBlockStatus, t]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('today_title')}</Text>
        <StreakBadge days={streak} />

        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{isGoalMet ? t('today_all_done') : t('today_lock_active')}</Text>
          <Text style={styles.stateSubtitle}>{isFocusModeActive ? t('today_focus_active') : t('today_focus_prompt')}</Text>
          <Button title={t('today_lets_go')} onPress={startCountdown} disabled={isGoalMet || countdown !== null} />
        </View>

        {countdown !== null && <Text style={styles.countdown}>{t('today_countdown', {seconds: countdown})}</Text>}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('today_goals')}</Text>
          {dailyGoals.map(goal => {
            const gt = goal.type ? getGoalType(goal.type) : null;
            return (
              <View key={goal.id} style={styles.goalRow}>
                {gt ? <Text style={styles.goalRowIcon}>{gt.icon}</Text> : null}
                <Text style={styles.goalText}>{goal.title}</Text>
                <Text style={styles.goalProgress}>{goal.progress}/{goal.target}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('today_apps_blocked')}</Text>
          <View style={styles.appsGrid}>
            {blockedApps.map(app => (
              <AppCard key={app.id} app={app} locked={!isGoalMet} compact />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.xl, paddingBottom: spacing.xxxl},
  title: {...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm},
  stateCard: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.sm, marginTop: spacing.lg},
  stateTitle: {...typography.label, color: colors.textPrimary},
  stateSubtitle: {...typography.bodySmall, color: colors.textSecondary},
  countdown: {...typography.h1, color: colors.primary, textAlign: 'center', marginTop: spacing.lg},
  section: {marginTop: spacing.xl},
  sectionTitle: {...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm},
  goalRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm},
  goalRowIcon: {fontSize: 20},
  goalText: {...typography.body, color: colors.textPrimary, flex: 1},
  goalProgress: {...typography.label, color: colors.primary},
  appsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md},
});
