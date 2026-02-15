import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppCard, AVAILABLE_APPS, Button} from '../../components';
import {useAppStore, useGoalStore, useAuthStore, useOnboardingStore, useLocaleStore} from '../../store';
import {colors, typography, spacing, borderRadius, GOAL_TYPES, getGoalType} from '../../theme';
import {saveSessionSnapshot, signUpWithEmail} from '../../services/supabaseService';
import {useTranslation} from '../../i18n/useTranslation';

export const SettingsScreen: React.FC = () => {
  const {blockedAppIds, toggleApp} = useAppStore();
  const {dailyGoals, addGoal, updateGoal, removeGoal} = useGoalStore();
  const {isRegistered, setRegistered, userId} = useAuthStore();
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const {locale, setLocale} = useLocaleStore();
  const {t} = useTranslation();

  const [customTitle, setCustomTitle] = useState('');
  const [customTarget, setCustomTarget] = useState('10');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddPredefined = (gt: (typeof GOAL_TYPES)[0]) => {
    addGoal(t(`goalType_${gt.id}`), gt.defaultTarget, gt.id);
  };

  const handleAddCustom = () => {
    const target = parseInt(customTarget, 10);
    if (!customTitle.trim() || target <= 0) return;
    addGoal(customTitle.trim(), target, 'custom');
    setCustomTitle('');
    setCustomTarget('10');
    setShowCustomInput(false);
  };

  const handleRegister = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      if (result.userId) {
        setRegistered(result.userId, email);
        await saveSessionSnapshot(result.userId, {
          blockedAppIds,
          dailyGoals,
          createdAt: new Date().toISOString(),
        });
        Alert.alert(t('settings_account_created'), t('settings_account_created_message'));
      }
    } catch {
      Alert.alert(t('settings_error'), t('settings_register_error'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('settings_title')}</Text>

        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <View style={styles.languageRow}>
          <TouchableOpacity
            style={[styles.langOption, locale === 'en' && styles.langOptionActive]}
            onPress={() => setLocale('en')}
            activeOpacity={0.8}>
            <Text style={[styles.langOptionText, locale === 'en' && styles.langOptionTextActive]}>{t('language_en')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langOption, locale === 'es' && styles.langOptionActive]}
            onPress={() => setLocale('es')}
            activeOpacity={0.8}>
            <Text style={[styles.langOptionText, locale === 'es' && styles.langOptionTextActive]}>{t('language_es')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('settings_goals')}</Text>
        {dailyGoals.map(goal => {
          const gt = goal.type ? getGoalType(goal.type) : null;
          const icon = gt ? gt.icon : '✏️';
          const label = goal.type === 'custom' ? goal.title : (gt ? t(`goalType_${gt.id}`) : goal.title);
          return (
            <View key={goal.id} style={styles.goalRow}>
              <View style={styles.goalIconWrap}>
                <Text style={styles.goalIcon}>{icon}</Text>
              </View>
              <Text style={styles.goalLabel} numberOfLines={1}>{label}</Text>
              <TextInput
                value={String(goal.target)}
                onChangeText={t => updateGoal(goal.id, {target: parseInt(t, 10) || 1})}
                style={styles.goalTargetInput}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                onPress={() => removeGoal(goal.id)}
                style={styles.removeBtn}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.addLabel}>{t('settings_add_goal')}</Text>
        <View style={styles.predefinedRow}>
          {GOAL_TYPES.map(gt => (
            <TouchableOpacity
              key={gt.id}
              style={styles.predefinedPill}
              onPress={() => handleAddPredefined(gt)}
              activeOpacity={0.8}>
              <Text style={styles.predefinedIcon}>{gt.icon}</Text>
              <Text style={styles.predefinedText}>{t(`goalType_${gt.id}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!showCustomInput ? (
          <TouchableOpacity
            style={styles.customPill}
            onPress={() => setShowCustomInput(true)}
            activeOpacity={0.8}>
            <Text style={styles.customPillIcon}>✏️</Text>
            <Text style={styles.customPillText}>{t('settings_custom_goal')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customInputCard}>
            <TextInput
              placeholder={t('settings_custom_placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={customTitle}
              onChangeText={setCustomTitle}
              style={styles.customTitleInput}
            />
            <View style={styles.customRow}>
              <TextInput
                value={customTarget}
                onChangeText={setCustomTarget}
                style={styles.customTargetInput}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.addCustomBtn} onPress={handleAddCustom}>
                <Text style={styles.addCustomBtnText}>{t('settings_add')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowCustomInput(false)}>
                <Text style={styles.cancelText}>{t('settings_cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t('settings_apps_block')}</Text>
        <View style={styles.listCard}>
          {AVAILABLE_APPS.map(app => (
            <AppCard key={app.id} app={app} selected={blockedAppIds.includes(app.id)} onToggle={toggleApp} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('settings_account')}</Text>
        {isRegistered ? (
          <Text style={styles.registered}>{t('settings_linked', {userId: userId ?? ''})}</Text>
        ) : (
          <View style={styles.authCard}>
            <TextInput
              placeholder={t('settings_email_placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              style={styles.authInput}
              autoCapitalize="none"
            />
            <TextInput
              placeholder={t('settings_password_placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              style={styles.authInput}
              secureTextEntry
            />
            <Button title={t('settings_create_account')} onPress={handleRegister} />
          </View>
        )}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() =>
            Alert.alert(t('settings_reset_alert_title'), t('settings_reset_alert_message'), [
              {text: t('settings_alert_cancel'), style: 'cancel'},
              {text: t('settings_alert_reset'), style: 'destructive', onPress: resetOnboarding},
            ])
          }>
          <Text style={styles.resetIcon}>🔄</Text>
          <Text style={styles.resetText}>{t('settings_redo_setup')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.xl, paddingBottom: spacing.xxxl},
  title: {...typography.h2, color: colors.textPrimary},
  sectionTitle: {...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm},
  languageRow: {flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm},
  langOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  langOptionActive: {borderColor: colors.primary, backgroundColor: colors.primary + '12'},
  langOptionText: {...typography.body, color: colors.textSecondary},
  langOptionTextActive: {color: colors.primary, fontWeight: '600'},
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  goalIconWrap: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center'},
  goalIcon: {fontSize: 20},
  goalLabel: {...typography.body, color: colors.textPrimary, flex: 1},
  goalTargetInput: {
    width: 56,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.label,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  removeBtn: {padding: spacing.xs},
  removeBtnText: {...typography.body, color: colors.textTertiary},
  addLabel: {...typography.label, color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm},
  predefinedRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  predefinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  predefinedIcon: {fontSize: 18},
  predefinedText: {...typography.caption, color: colors.textPrimary},
  customPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: colors.primary + '0C',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  customPillIcon: {fontSize: 18},
  customPillText: {...typography.label, color: colors.primary},
  customInputCard: {marginTop: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm},
  customTitleInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  customRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  customTargetInput: {
    width: 56,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...typography.label,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  addCustomBtn: {backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  addCustomBtnText: {...typography.labelSmall, color: colors.textInverse},
  cancelText: {...typography.bodySmall, color: colors.textTertiary},
  listCard: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden'},
  authCard: {backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm},
  authInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  registered: {...typography.body, color: colors.primary},
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  resetIcon: {fontSize: 22},
  resetText: {...typography.label, color: colors.textPrimary},
});
